"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/authorization";
import { prisma } from "@/lib/prisma";

export async function markNotificationReadAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
  const notificationId = String(formData.get("notificationId") ?? "");
  if (!notificationId) throw new Error("Notifikasi tidak valid.");

  await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id },
    data: { readAt: new Date() },
  });
  revalidatePath("/notifications");
}

export async function markAllNotificationsReadAction() {
  const user = await requireRole(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
  await prisma.notification.updateMany({
    where: { userId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  revalidatePath("/notifications");
}
