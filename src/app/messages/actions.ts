"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { messageSchema } from "@/lib/forms";
import { notifyUser } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

function values(formData: FormData) {
  return Object.fromEntries(formData.entries());
}

export async function sendMessageAction(formData: FormData) {
  const sender = await requireRole(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
  const input = messageSchema.parse(values(formData));
  if (input.recipientId === sender.id) throw new Error("Penerima tidak valid.");

  const recipient = await prisma.user.findFirst({
    where: { id: input.recipientId, status: "ACTIVE" },
    select: { id: true, name: true },
  });
  if (!recipient) throw new Error("Penerima tidak ditemukan.");

  const message = await prisma.message.create({
    data: {
      senderId: sender.id,
      recipientId: recipient.id,
      subject: input.subject,
      body: input.body,
    },
  });

  await writeAuditLog(sender.id, "SEND_MESSAGE", `Message:${message.id}`, { recipient: recipient.name });
  await notifyUser(recipient.id, "Pesan baru", `${sender.name} mengirim pesan: ${input.subject}.`);
  revalidatePath("/admin/inbox");
  revalidatePath("/participant/inbox");
  revalidatePath("/mentor/inbox");
  revalidatePath("/notifications");
}

export async function markMessageReadAction(formData: FormData) {
  const user = await requireRole(["ADMIN", "PARTICIPANT", "MENTOR", "PARTNER"]);
  const messageId = String(formData.get("messageId") ?? "");
  if (!messageId) throw new Error("Pesan tidak valid.");

  await prisma.message.updateMany({
    where: { id: messageId, recipientId: user.id, readAt: null },
    data: { readAt: new Date() },
  });
  await writeAuditLog(user.id, "READ_MESSAGE", `Message:${messageId}`);
  revalidatePath("/admin/inbox");
  revalidatePath("/participant/inbox");
  revalidatePath("/mentor/inbox");
}
