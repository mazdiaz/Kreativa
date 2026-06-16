import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const accounts = [
  ["Admin Program", "admin@inklusikarya.test", "ADMIN"],
  ["Siti Rahma", "peserta@inklusikarya.test", "PARTICIPANT"],
  ["Budi Mentor", "mentor@inklusikarya.test", "MENTOR"],
  ["Mitra Nusantara", "mitra@inklusikarya.test", "PARTNER"],
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);
  for (const [name, email, role] of accounts) {
    await prisma.user.upsert({
      where: { email },
      update: { name, role, passwordHash },
      create: { name, email, role, passwordHash },
    });
  }

  const participantUser = await prisma.user.findUniqueOrThrow({ where: { email: "peserta@inklusikarya.test" } });
  const participant = await prisma.participantProfile.upsert({
    where: { userId: participantUser.id },
    update: {},
    create: {
      userId: participantUser.id,
      disabilityNeed: "Dukungan navigasi visual dan instruksi ringkas",
      localPotential: "Kerajinan kain perca dan kuliner lokal",
      address: "Bandung",
      consentStatus: true,
    },
  });

  const program = await prisma.program.upsert({
    where: { id: "demo-program-kriya" },
    update: {},
    create: {
      id: "demo-program-kriya",
      name: "Pelatihan Kriya Kreatif Berbasis Potensi Lokal",
      type: "Vokasional",
      description: "Program pengembangan keterampilan kriya, pengemasan, dan pemasaran produk.",
      period: "2026-Q3",
      status: "OPEN",
    },
  });

  await prisma.registration.create({ data: { participantId: participant.id, programId: program.id, status: "APPROVED" } }).catch(() => {});
  await prisma.assessment.create({ data: { participantId: participant.id, score: 82, recommendation: "Kriya kreatif dan pemasaran digital dasar", notes: "Peserta memiliki minat kuat pada produk berbasis kain lokal." } });
  await prisma.trainingModule.create({ data: { programId: program.id, title: "Dasar Kriya dan Desain Produk", description: "Teknik dasar, keselamatan kerja, dan desain produk sederhana." } });
  await prisma.schedule.create({ data: { programId: program.id, title: "Workshop Kriya Pertama", date: new Date("2026-07-10T09:00:00+07:00"), location: "Ruang Pelatihan Bandung" } });
  await prisma.businessIdea.create({ data: { participantId: participant.id, title: "Tas Kain Perca Inklusif", description: "Produk tas harian dari sisa kain lokal.", localPotential: "Kain perca dari penjahit lokal", status: "IN_REVIEW" } });
  await prisma.product.create({ data: { participantId: participant.id, name: "Tas Perca Mandiri", category: "Kriya", description: "Tas kain buatan peserta dengan motif lokal.", imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop" } });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
