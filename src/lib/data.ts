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
    name: profile.user.name,
    address: profile.address,
    localPotential: profile.localPotential,
    disabilityNeed: profile.disabilityNeed,
    program: profile.registrations[0]?.program.name ?? "-",
    progress: participantProgress(profile.progressRecords),
    status: profile.registrations[0]?.status ?? "BELUM TERDAFTAR",
  }));
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
    },
  });

  if (!profile) return { profile: null, modules: [], schedules: [], assessments: [], businessIdeas: [] };
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
