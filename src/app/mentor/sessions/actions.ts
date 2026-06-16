"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { mentoringSessionSchema } from "@/lib/forms";
import { prisma } from "@/lib/prisma";

export async function createMentoringSessionAction(formData: FormData) {
  const user = await requireRole(["MENTOR"]);
  const input = mentoringSessionSchema.parse(Object.fromEntries(formData.entries()));
  const session = await prisma.mentoringSession.create({
    data: {
      mentorId: user.id,
      participantId: input.participantId,
      topic: input.topic,
      notes: input.notes,
      nextAction: input.nextAction,
      sessionDate: new Date(),
    },
  });
  await writeAuditLog(user.id, "CREATE_MENTORING_SESSION", `MentoringSession:${session.id}`, { topic: session.topic });
  revalidatePath("/mentor");
  revalidatePath("/mentor/sessions");
  revalidatePath("/admin/reports");
}
