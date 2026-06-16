import { prisma } from "./prisma";

const fallbackImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop";

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(date);
}

function average(values: number[]) {
  if (!values.length) return 0;
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function participantProgress(progressRecords: Array<{ completion: number }>) {
  return average(progressRecords.map((record) => record.completion));
}

export async function getDashboardStats() {
  const [participantCount, productCount, sessionCount, progressRecords] = await Promise.all([
    prisma.participantProfile.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.mentoringSession.count(),
    prisma.progressRecord.findMany({ select: { completion: true } }),
  ]);

  return [
    { label: "Peserta aktif", value: String(participantCount), detail: "Profil peserta tersimpan di database" },
    { label: "Rata-rata progres", value: `${average(progressRecords.map((item) => item.completion))}%`, detail: "Berdasarkan progress record peserta" },
    { label: "Produk etalase", value: String(productCount), detail: "Produk berstatus published" },
    { label: "Sesi mentoring", value: String(sessionCount), detail: "Catatan mentoring tersimpan" },
  ];
}

export async function getActivePrograms() {
  return prisma.program.findMany({
    where: { status: { in: ["OPEN", "ACTIVE"] } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminParticipants() {
  const profiles = await prisma.participantProfile.findMany({
    include: {
      user: true,
      registrations: {
        include: { program: true },
        orderBy: { createdAt: "desc" },
      },
      progressRecords: { select: { completion: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return profiles.map((profile) => ({
    id: profile.id,
    userId: profile.userId,
    email: profile.user.email,
    name: profile.user.name,
    userStatus: profile.user.status,
    address: profile.address,
    localPotential: profile.localPotential,
    disabilityNeed: profile.disabilityNeed,
    consentStatus: profile.consentStatus,
    program: profile.registrations[0]?.program.name ?? "-",
    progress: participantProgress(profile.progressRecords),
    status: profile.registrations[0]?.status ?? "BELUM TERDAFTAR",
  }));
}

export async function getAdminUsers() {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminRegistrations() {
  return prisma.registration.findMany({
    include: {
      participant: { include: { user: true } },
      program: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProgramManagementData() {
  const programs = await prisma.program.findMany({
    include: {
      modules: { orderBy: { createdAt: "desc" } },
      schedules: { orderBy: { date: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    programs,
    modules: programs.flatMap((program) =>
      program.modules.map((module) => ({
        ...module,
        programName: program.name,
      })),
    ),
    schedules: programs.flatMap((program) =>
      program.schedules.map((schedule) => ({
        ...schedule,
        programName: program.name,
        displayDate: formatDate(schedule.date),
      })),
    ),
  };
}

export async function getShowcaseProducts() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    include: { participant: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl || fallbackImageUrl,
    participant: product.participant.user.name,
  }));
}

export async function getAdminProducts() {
  const products = await prisma.product.findMany({
    include: { participant: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  });

  return products.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl || fallbackImageUrl,
    status: product.status,
    participant: product.participant.user.name,
  }));
}

export async function getShowcaseProduct(id: string) {
  const product = await prisma.product.findFirst({
    where: { id, status: "PUBLISHED" },
    include: { participant: { include: { user: true } } },
  });

  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    imageUrl: product.imageUrl || fallbackImageUrl,
    participant: product.participant.user.name,
  };
}

export async function getAdminReportsData() {
  const [stats, businessIdeas, products] = await Promise.all([
    getDashboardStats(),
    prisma.businessIdea.findMany({
      include: { participant: { include: { user: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getShowcaseProducts(),
  ]);

  return {
    stats,
    businessIdeas: businessIdeas.map((idea) => ({
      title: idea.title,
      participant: idea.participant.user.name,
      localPotential: idea.localPotential,
      status: idea.status,
    })),
    products,
  };
}

export async function getParticipantLearningData(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    include: {
      registrations: {
        include: {
          program: {
            include: {
              modules: { orderBy: { createdAt: "asc" } },
              schedules: { orderBy: { date: "asc" } },
            },
          },
        },
      },
      progressRecords: { include: { module: true } },
      assessments: { orderBy: { createdAt: "desc" } },
      businessIdeas: { orderBy: { createdAt: "desc" } },
      products: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!profile) return { profile: null, modules: [], schedules: [], assessments: [], businessIdeas: [], products: [], registrations: [] };
  const progressByModule = new Map(profile.progressRecords.map((record) => [record.moduleId, record.completion]));
  const programs = profile.registrations.map((registration) => registration.program);

  return {
    profile,
    modules: programs.flatMap((program) =>
      program.modules.map((module) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        completion: progressByModule.get(module.id) ?? 0,
      })),
    ),
    schedules: programs.flatMap((program) =>
      program.schedules.map((schedule) => ({
        id: schedule.id,
        title: schedule.title,
        program: program.name,
        date: formatDate(schedule.date),
        location: schedule.location,
      })),
    ),
    assessments: profile.assessments,
    businessIdeas: profile.businessIdeas,
    products: profile.products,
    registrations: profile.registrations.map((registration) => ({
      id: registration.id,
      program: registration.program.name,
      status: registration.status,
      createdAt: formatDate(registration.createdAt),
    })),
  };
}

export async function getParticipantPrograms(userId: string) {
  const profile = await prisma.participantProfile.findUnique({
    where: { userId },
    include: { registrations: true },
  });
  const programs = await getActivePrograms();
  const registered = new Map((profile?.registrations ?? []).map((registration) => [registration.programId, registration.status]));

  return {
    profile,
    programs: programs.map((program) => ({
      ...program,
      registrationStatus: registered.get(program.id) ?? null,
    })),
  };
}

export async function getAttendanceProgressData() {
  const [participants, programs, attendances, progressRecords] = await Promise.all([
    prisma.participantProfile.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.program.findMany({
      include: {
        schedules: { orderBy: { date: "asc" } },
        modules: { orderBy: { createdAt: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.attendance.findMany({
      include: { participant: { include: { user: true } }, schedule: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.progressRecord.findMany({
      include: { participant: { include: { user: true } }, module: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return {
    participants,
    schedules: programs.flatMap((program) => program.schedules.map((schedule) => ({ ...schedule, programName: program.name, displayDate: formatDate(schedule.date) }))),
    modules: programs.flatMap((program) => program.modules.map((module) => ({ ...module, programName: program.name }))),
    attendances: attendances.map((attendance) => ({
      id: attendance.id,
      participant: attendance.participant.user.name,
      schedule: attendance.schedule.title,
      status: attendance.status,
      createdAt: formatDate(attendance.createdAt),
    })),
    progressRecords: progressRecords.map((record) => ({
      id: record.id,
      participant: record.participant.user.name,
      module: record.module.title,
      completion: record.completion,
      notes: record.notes,
    })),
  };
}

export async function getMentorDashboardData(mentorId: string) {
  const [participants, sessions, messages] = await Promise.all([
    getAdminParticipants(),
    prisma.mentoringSession.findMany({
      where: { mentorId },
      include: { participant: { include: { user: true } } },
      orderBy: { sessionDate: "desc" },
    }),
    prisma.message.findMany({
      where: { recipientId: mentorId },
      include: { sender: true, recipient: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    participants,
    sessions: sessions.map((session) => ({
      id: session.id,
      participant: session.participant.user.name,
      topic: session.topic,
      notes: session.notes,
      nextAction: session.nextAction,
      date: formatDate(session.sessionDate),
    })),
    messages: messages.map((message) => ({
      id: message.id,
      sender: message.sender.name,
      recipient: message.recipient.name,
      subject: message.subject,
      body: message.body,
      read: Boolean(message.readAt),
    })),
  };
}

export async function getInboxData(userId: string) {
  const [messages, recipients] = await Promise.all([
    prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { recipientId: userId }] },
      include: { sender: true, recipient: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      where: { status: "ACTIVE", id: { not: userId } },
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    recipients,
    messages: messages.map((message) => ({
      id: message.id,
      sender: message.sender.name,
      recipient: message.recipient.name,
      subject: message.subject,
      body: message.body,
      status: message.readAt ? "Sudah dibaca" : "Belum dibaca",
      createdAt: formatDate(message.createdAt),
    })),
  };
}

export async function getNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBackupData() {
  const [users, participants, programs, registrations, assessments, modules, schedules, attendances, progress, sessions, messages, ideas, products, reports, notifications, auditLogs] =
    await Promise.all([
      prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, status: true, createdAt: true, updatedAt: true } }),
      prisma.participantProfile.findMany(),
      prisma.program.findMany(),
      prisma.registration.findMany(),
      prisma.assessment.findMany(),
      prisma.trainingModule.findMany(),
      prisma.schedule.findMany(),
      prisma.attendance.findMany(),
      prisma.progressRecord.findMany(),
      prisma.mentoringSession.findMany(),
      prisma.message.findMany(),
      prisma.businessIdea.findMany(),
      prisma.product.findMany(),
      prisma.report.findMany(),
      prisma.notification.findMany(),
      prisma.auditLog.findMany(),
    ]);

  return {
    exportedAt: new Date().toISOString(),
    users,
    participants,
    programs,
    registrations,
    assessments,
    modules,
    schedules,
    attendances,
    progress,
    sessions,
    messages,
    ideas,
    products,
    reports,
    notifications,
    auditLogs,
  };
}
