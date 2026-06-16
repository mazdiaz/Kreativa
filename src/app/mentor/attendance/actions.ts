"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { attendanceSchema, progressSchema } from "@/lib/forms";
import { notifyUser } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function recordAttendanceAction(formData: FormData) {
  const mentor = await requireRole(["MENTOR"]);
  const input = attendanceSchema.parse(values(formData));
  const existing = await prisma.attendance.findFirst({
    where: { participantId: input.participantId, scheduleId: input.scheduleId },
  });

  const attendance = existing
    ? await prisma.attendance.update({ where: { id: existing.id }, data: { status: input.status } })
    : await prisma.attendance.create({
        data: {
          participantId: input.participantId,
          scheduleId: input.scheduleId,
          status: input.status,
        },
      });

  const participant = await prisma.participantProfile.findUnique({ where: { id: input.participantId }, include: { user: true } });
  await writeAuditLog(mentor.id, "UPSERT_ATTENDANCE", `Attendance:${attendance.id}`, { status: input.status });
  if (participant) {
    await notifyUser(participant.userId, "Absensi diperbarui", `Status absensi Anda dicatat sebagai ${input.status}.`);
  }
  revalidatePath("/mentor/attendance");
  revalidatePath("/participant/progress");
}

export async function updateProgressAction(formData: FormData) {
  const mentor = await requireRole(["MENTOR"]);
  const input = progressSchema.parse(values(formData));
  const existing = await prisma.progressRecord.findFirst({
    where: { participantId: input.participantId, moduleId: input.moduleId },
  });

  const progress = existing
    ? await prisma.progressRecord.update({
        where: { id: existing.id },
        data: { completion: input.completion, notes: input.notes },
      })
    : await prisma.progressRecord.create({
        data: {
          participantId: input.participantId,
          moduleId: input.moduleId,
          completion: input.completion,
          notes: input.notes,
        },
      });

  const participant = await prisma.participantProfile.findUnique({ where: { id: input.participantId }, include: { user: true } });
  await writeAuditLog(mentor.id, "UPSERT_PROGRESS", `ProgressRecord:${progress.id}`, { completion: input.completion });
  if (participant) {
    await notifyUser(participant.userId, "Progres pelatihan diperbarui", `Progres modul Anda dicatat ${input.completion}%.`);
  }
  revalidatePath("/mentor/attendance");
  revalidatePath("/mentor/participants");
  revalidatePath("/participant/progress");
  revalidatePath("/admin");
}
