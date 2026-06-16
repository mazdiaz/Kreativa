"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { assessmentSchema, businessIdeaSchema } from "@/lib/forms";
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
