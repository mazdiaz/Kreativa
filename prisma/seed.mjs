import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import {
  assessments,
  attendances,
  auditLogs,
  businessIdeas,
  mentoringSessions,
  messages,
  modules,
  notifications,
  products,
  programs,
  progressRecords,
  registrations,
  reports,
  schedules,
} from "./seed-data.mjs";

const prisma = new PrismaClient();

const accounts = [
  { name: "Admin Program", email: "admin@kreativa.com", legacyEmail: "admin@kreativa.test", role: "ADMIN" },
  { name: "Siti Rahma", email: "peserta@kreativa.com", legacyEmail: "peserta@kreativa.test", role: "PARTICIPANT" },
  { name: "Budi Mentor", email: "mentor@kreativa.com", legacyEmail: "mentor@kreativa.test", role: "MENTOR" },
  { name: "Mitra Kreativa", email: "mitra@kreativa.com", legacyEmail: "mitra@kreativa.test", role: "PARTNER" },
];

async function seedAccounts(passwordHash) {
  for (const { name, email, legacyEmail, role } of accounts) {
    const currentAccount = await prisma.user.findUnique({ where: { email } });
    if (!currentAccount) {
      await prisma.user.updateMany({
        where: { email: legacyEmail },
        data: { email },
      });
    }

    await prisma.user.upsert({
      where: { email },
      update: { name, role, passwordHash },
      create: { name, email, role, passwordHash },
    });
  }
}

async function getUserByEmail(email) {
  return prisma.user.findUniqueOrThrow({ where: { email } });
}

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  await seedAccounts(passwordHash);

  const adminUser = await getUserByEmail("admin@kreativa.com");
  const participantUser = await getUserByEmail("peserta@kreativa.com");
  const mentorUser = await getUserByEmail("mentor@kreativa.com");
  const partnerUser = await getUserByEmail("mitra@kreativa.com");

  const participant = await prisma.participantProfile.upsert({
    where: { userId: participantUser.id },
    update: {
      disabilityNeed: "Dukungan navigasi visual, instruksi ringkas, dan kontras tinggi",
      localPotential: "Kerajinan kain perca, kuliner singkong lokal, dan desain katalog digital",
      address: "Bandung",
      consentStatus: true,
    },
    create: {
      userId: participantUser.id,
      disabilityNeed: "Dukungan navigasi visual, instruksi ringkas, dan kontras tinggi",
      localPotential: "Kerajinan kain perca, kuliner singkong lokal, dan desain katalog digital",
      address: "Bandung",
      consentStatus: true,
    },
  });

  for (const program of programs) {
    await prisma.program.upsert({
      where: { id: program.id },
      update: program,
      create: program,
    });
  }

  for (const trainingModule of modules) {
    await prisma.trainingModule.upsert({
      where: { id: trainingModule.id },
      update: {
        programId: trainingModule.programId,
        title: trainingModule.title,
        description: trainingModule.description,
        materialUrl: trainingModule.materialUrl || null,
      },
      create: {
        id: trainingModule.id,
        programId: trainingModule.programId,
        title: trainingModule.title,
        description: trainingModule.description,
        materialUrl: trainingModule.materialUrl || null,
      },
    });
  }

  for (const schedule of schedules) {
    await prisma.schedule.upsert({
      where: { id: schedule.id },
      update: {
        programId: schedule.programId,
        title: schedule.title,
        date: new Date(schedule.date),
        location: schedule.location,
      },
      create: {
        id: schedule.id,
        programId: schedule.programId,
        title: schedule.title,
        date: new Date(schedule.date),
        location: schedule.location,
      },
    });
  }

  for (const registration of registrations) {
    await prisma.registration.upsert({
      where: { id: registration.id },
      update: {
        participantId: participant.id,
        programId: registration.programId,
        status: registration.status,
      },
      create: {
        id: registration.id,
        participantId: participant.id,
        programId: registration.programId,
        status: registration.status,
      },
    });
  }

  for (const assessment of assessments) {
    await prisma.assessment.upsert({
      where: { id: assessment.id },
      update: {
        participantId: participant.id,
        score: assessment.score,
        recommendation: assessment.recommendation,
        notes: assessment.notes,
      },
      create: {
        id: assessment.id,
        participantId: participant.id,
        score: assessment.score,
        recommendation: assessment.recommendation,
        notes: assessment.notes,
      },
    });
  }

  for (const attendance of attendances) {
    await prisma.attendance.upsert({
      where: { id: attendance.id },
      update: {
        scheduleId: attendance.scheduleId,
        participantId: participant.id,
        status: attendance.status,
      },
      create: {
        id: attendance.id,
        scheduleId: attendance.scheduleId,
        participantId: participant.id,
        status: attendance.status,
      },
    });
  }

  for (const progress of progressRecords) {
    await prisma.progressRecord.upsert({
      where: { id: progress.id },
      update: {
        participantId: participant.id,
        moduleId: progress.moduleId,
        completion: progress.completion,
        notes: progress.notes,
      },
      create: {
        id: progress.id,
        participantId: participant.id,
        moduleId: progress.moduleId,
        completion: progress.completion,
        notes: progress.notes,
      },
    });
  }

  for (const session of mentoringSessions) {
    await prisma.mentoringSession.upsert({
      where: { id: session.id },
      update: {
        mentorId: mentorUser.id,
        participantId: participant.id,
        topic: session.topic,
        notes: session.notes,
        nextAction: session.nextAction,
        sessionDate: new Date(session.sessionDate),
      },
      create: {
        id: session.id,
        mentorId: mentorUser.id,
        participantId: participant.id,
        topic: session.topic,
        notes: session.notes,
        nextAction: session.nextAction,
        sessionDate: new Date(session.sessionDate),
      },
    });
  }

  for (const idea of businessIdeas) {
    await prisma.businessIdea.upsert({
      where: { id: idea.id },
      update: {
        participantId: participant.id,
        title: idea.title,
        description: idea.description,
        localPotential: idea.localPotential,
        status: idea.status,
      },
      create: {
        id: idea.id,
        participantId: participant.id,
        title: idea.title,
        description: idea.description,
        localPotential: idea.localPotential,
        status: idea.status,
      },
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        participantId: participant.id,
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
      },
      create: {
        id: product.id,
        participantId: participant.id,
        name: product.name,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        status: product.status,
      },
    });
  }

  const usersByEmail = new Map([
    [adminUser.email, adminUser],
    [participantUser.email, participantUser],
    [mentorUser.email, mentorUser],
    [partnerUser.email, partnerUser],
  ]);

  for (const message of messages) {
    await prisma.message.upsert({
      where: { id: message.id },
      update: {
        senderId: usersByEmail.get(message.senderEmail).id,
        recipientId: usersByEmail.get(message.recipientEmail).id,
        subject: message.subject,
        body: message.body,
      },
      create: {
        id: message.id,
        senderId: usersByEmail.get(message.senderEmail).id,
        recipientId: usersByEmail.get(message.recipientEmail).id,
        subject: message.subject,
        body: message.body,
      },
    });
  }

  for (const notification of notifications) {
    await prisma.notification.upsert({
      where: { id: notification.id },
      update: {
        userId: usersByEmail.get(notification.userEmail).id,
        title: notification.title,
        body: notification.body,
      },
      create: {
        id: notification.id,
        userId: usersByEmail.get(notification.userEmail).id,
        title: notification.title,
        body: notification.body,
      },
    });
  }

  for (const report of reports) {
    await prisma.report.upsert({
      where: { id: report.id },
      update: report,
      create: report,
    });
  }

  for (const auditLog of auditLogs) {
    await prisma.auditLog.upsert({
      where: { id: auditLog.id },
      update: {
        actorId: usersByEmail.get(auditLog.actorEmail).id,
        action: auditLog.action,
        object: auditLog.object,
        metadata: JSON.stringify(auditLog.metadata),
      },
      create: {
        id: auditLog.id,
        actorId: usersByEmail.get(auditLog.actorEmail).id,
        action: auditLog.action,
        object: auditLog.object,
        metadata: JSON.stringify(auditLog.metadata),
      },
    });
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
