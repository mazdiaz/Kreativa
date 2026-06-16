"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { participantSchema, registrationStatusSchema } from "@/lib/forms";
import { notifyUser } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

function requiredId(formData: FormData, key: string) {
  const id = String(formData.get(key) ?? "");
  if (!id) throw new Error("ID tidak valid.");
  return id;
}

export async function createParticipantAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const input = participantSchema.parse(values(formData));
  const passwordHash = await bcrypt.hash("password123", 10);

  const participantUser = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: "PARTICIPANT",
      status: input.status,
      participant: {
        create: {
          address: input.address,
          disabilityNeed: input.disabilityNeed,
          localPotential: input.localPotential,
          consentStatus: input.consentStatus,
        },
      },
    },
  });

  await writeAuditLog(actor.id, "CREATE_PARTICIPANT", `User:${participantUser.id}`, { email: input.email });
  await notifyUser(participantUser.id, "Akun peserta dibuat", "Admin telah membuat akun peserta. Password awal: password123.");
  revalidatePath("/admin");
  revalidatePath("/admin/participants");
}

export async function updateParticipantAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const userId = requiredId(formData, "userId");
  const profileId = requiredId(formData, "profileId");
  const input = participantSchema.parse(values(formData));

  await prisma.user.update({
    where: { id: userId },
    data: { name: input.name, email: input.email, status: input.status },
  });
  await prisma.participantProfile.update({
    where: { id: profileId },
    data: {
      address: input.address,
      disabilityNeed: input.disabilityNeed,
      localPotential: input.localPotential,
      consentStatus: input.consentStatus,
    },
  });

  await writeAuditLog(actor.id, "UPDATE_PARTICIPANT", `ParticipantProfile:${profileId}`, { email: input.email });
  revalidatePath("/admin");
  revalidatePath("/admin/participants");
}

export async function deleteParticipantAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const userId = requiredId(formData, "userId");

  await prisma.user.delete({ where: { id: userId } });
  await writeAuditLog(actor.id, "DELETE_PARTICIPANT", `User:${userId}`);
  revalidatePath("/admin");
  revalidatePath("/admin/participants");
}

export async function updateRegistrationStatusAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const input = registrationStatusSchema.parse(values(formData));
  const registration = await prisma.registration.update({
    where: { id: input.registrationId },
    data: { status: input.status },
    include: { participant: { include: { user: true } }, program: true },
  });

  await writeAuditLog(actor.id, "UPDATE_REGISTRATION_STATUS", `Registration:${registration.id}`, {
    status: input.status,
    program: registration.program.name,
  });
  await notifyUser(
    registration.participant.userId,
    "Status pendaftaran diperbarui",
    `Pendaftaran program ${registration.program.name} sekarang berstatus ${input.status}.`,
  );
  revalidatePath("/admin");
  revalidatePath("/admin/participants");
  revalidatePath("/participant");
  revalidatePath("/participant/programs");
}
