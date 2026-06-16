"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { assessmentSchema, businessIdeaSchema, productSchema, programRegistrationSchema } from "@/lib/forms";
import { notifyRole } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

async function requireParticipantProfile(userId: string) {
  const profile = await prisma.participantProfile.findUnique({ where: { userId } });
  if (!profile) throw new Error("Profil peserta belum tersedia.");
  return profile;
}

export async function createAssessmentAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const input = assessmentSchema.parse(values(formData));
  const assessment = await prisma.assessment.create({
    data: {
      participantId: profile.id,
      score: input.score,
      recommendation: input.recommendation,
      notes: input.notes,
    },
  });
  await writeAuditLog(user.id, "CREATE_ASSESSMENT", `Assessment:${assessment.id}`, { score: input.score });
  revalidatePath("/participant/assessment");
}

export async function createBusinessIdeaAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const input = businessIdeaSchema.parse(values(formData));
  const idea = await prisma.businessIdea.create({
    data: {
      participantId: profile.id,
      title: input.title,
      description: input.description,
      localPotential: input.localPotential,
      status: input.status,
    },
  });
  await writeAuditLog(user.id, "CREATE_BUSINESS_IDEA", `BusinessIdea:${idea.id}`, { title: idea.title });
  revalidatePath("/participant/business-ideas");
  revalidatePath("/admin/reports");
}

export async function registerProgramAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const input = programRegistrationSchema.parse(values(formData));
  const existing = await prisma.registration.findFirst({
    where: { participantId: profile.id, programId: input.programId },
    include: { program: true },
  });

  if (existing) {
    await prisma.registration.update({
      where: { id: existing.id },
      data: { status: existing.status === "REJECTED" ? "PENDING" : existing.status },
    });
    await writeAuditLog(user.id, "RESUBMIT_PROGRAM_REGISTRATION", `Registration:${existing.id}`, { program: existing.program.name });
  } else {
    const registration = await prisma.registration.create({
      data: { participantId: profile.id, programId: input.programId, status: "PENDING" },
      include: { program: true },
    });
    await writeAuditLog(user.id, "CREATE_PROGRAM_REGISTRATION", `Registration:${registration.id}`, { program: registration.program.name });
    await notifyRole("ADMIN", "Pendaftaran program baru", `${user.name} mengajukan pendaftaran program ${registration.program.name}.`);
  }

  revalidatePath("/participant");
  revalidatePath("/participant/programs");
  revalidatePath("/admin/participants");
}

export async function createProductAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const input = productSchema.parse(values(formData));
  const product = await prisma.product.create({
    data: {
      participantId: profile.id,
      name: input.name,
      category: input.category,
      description: input.description,
      imageUrl: input.imageUrl || undefined,
      status: "PENDING",
    },
  });

  await writeAuditLog(user.id, "CREATE_PRODUCT", `Product:${product.id}`, { name: product.name });
  await notifyRole("ADMIN", "Produk menunggu kurasi", `${user.name} mengajukan produk ${product.name} untuk etalase.`);
  revalidatePath("/participant/products");
  revalidatePath("/admin/products");
}

export async function updateProductAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Produk tidak valid.");
  const input = productSchema.parse(values(formData));
  const existing = await prisma.product.findFirst({ where: { id: productId, participantId: profile.id } });
  if (!existing) throw new Error("Produk tidak ditemukan.");
  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name: input.name,
      category: input.category,
      description: input.description,
      imageUrl: input.imageUrl || undefined,
      status: "PENDING",
    },
  });

  await writeAuditLog(user.id, "UPDATE_PRODUCT", `Product:${product.id}`, { name: product.name });
  await notifyRole("ADMIN", "Produk diperbarui", `${user.name} memperbarui produk ${product.name} dan menunggu kurasi.`);
  revalidatePath("/participant/products");
  revalidatePath("/admin/products");
  revalidatePath("/showcase");
}

export async function deleteProductAction(formData: FormData) {
  const user = await requireRole(["PARTICIPANT"]);
  const profile = await requireParticipantProfile(user.id);
  const productId = String(formData.get("productId") ?? "");
  if (!productId) throw new Error("Produk tidak valid.");
  const product = await prisma.product.findFirst({ where: { id: productId, participantId: profile.id } });
  if (!product) throw new Error("Produk tidak ditemukan.");

  await prisma.product.delete({ where: { id: product.id } });
  await writeAuditLog(user.id, "DELETE_PRODUCT", `Product:${product.id}`);
  revalidatePath("/participant/products");
  revalidatePath("/admin/products");
  revalidatePath("/showcase");
}
