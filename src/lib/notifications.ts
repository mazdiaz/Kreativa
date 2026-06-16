import { prisma } from "./prisma";

export async function notifyUser(userId: string, title: string, body: string) {
  await prisma.notification.create({
    data: { userId, title, body },
  });
}

export async function notifyRole(role: "ADMIN" | "PARTICIPANT" | "MENTOR" | "PARTNER", title: string, body: string) {
  const users = await prisma.user.findMany({
    where: { role, status: "ACTIVE" },
    select: { id: true },
  });

  if (!users.length) return;
  await prisma.notification.createMany({
    data: users.map((user) => ({ userId: user.id, title, body })),
  });
}
