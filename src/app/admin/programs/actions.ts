"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { moduleSchema, programSchema, scheduleSchema } from "@/lib/forms";
import { prisma } from "@/lib/prisma";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function createProgramAction(formData: FormData) {
  const user = await requireRole(["ADMIN"]);
  const input = programSchema.parse(values(formData));
  const program = await prisma.program.create({ data: input });
  await writeAuditLog(user.id, "CREATE_PROGRAM", `Program:${program.id}`, { name: program.name });
  revalidatePath("/admin/programs");
  revalidatePath("/");
}

export async function updateProgramAction(formData: FormData) {
  const user = await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  const input = programSchema.parse(values(formData));
  const program = await prisma.program.update({ where: { id }, data: input });
  await writeAuditLog(user.id, "UPDATE_PROGRAM", `Program:${program.id}`, { name: program.name });
  revalidatePath("/admin/programs");
  revalidatePath("/");
}

export async function deleteProgramAction(formData: FormData) {
  const user = await requireRole(["ADMIN"]);
  const id = String(formData.get("id") ?? "");
  await prisma.program.delete({ where: { id } });
  await writeAuditLog(user.id, "DELETE_PROGRAM", `Program:${id}`);
  revalidatePath("/admin/programs");
  revalidatePath("/");
}

export async function createModuleAction(formData: FormData) {
  const user = await requireRole(["ADMIN"]);
  const input = moduleSchema.parse(values(formData));
  const trainingModule = await prisma.trainingModule.create({
    data: {
      ...input,
      materialUrl: input.materialUrl || undefined,
    },
  });
  await writeAuditLog(user.id, "CREATE_MODULE", `TrainingModule:${trainingModule.id}`, { title: trainingModule.title });
  revalidatePath("/admin/programs");
  revalidatePath("/participant/progress");
}

export async function createScheduleAction(formData: FormData) {
  const user = await requireRole(["ADMIN"]);
  const input = scheduleSchema.parse(values(formData));
  const date = new Date(input.date);
  if (Number.isNaN(date.getTime())) throw new Error("Tanggal jadwal tidak valid.");
  const schedule = await prisma.schedule.create({
    data: {
      ...input,
      date,
    },
  });
  await writeAuditLog(user.id, "CREATE_SCHEDULE", `Schedule:${schedule.id}`, { title: schedule.title });
  revalidatePath("/admin/programs");
  revalidatePath("/participant/progress");
}
