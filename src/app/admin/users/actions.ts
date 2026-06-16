"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { userSchema } from "@/lib/forms";
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

export async function createUserAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const input = userSchema.parse(values(formData));
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
      status: input.status,
    },
  });

  await writeAuditLog(actor.id, "CREATE_USER", `User:${user.id}`, { role: input.role });
  await notifyUser(user.id, "Akun pengguna dibuat", "Admin telah membuat akun untuk Anda. Password awal: password123.");
  revalidatePath("/admin/users");
}

export async function updateUserAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const userId = requiredId(formData, "userId");
  const input = userSchema.parse(values(formData));
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      email: input.email,
      role: input.role,
      status: input.status,
    },
  });

  await writeAuditLog(actor.id, "UPDATE_USER", `User:${user.id}`, { role: user.role, status: user.status });
  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const userId = requiredId(formData, "userId");
  if (userId === actor.id) throw new Error("Admin tidak dapat menghapus akunnya sendiri.");

  await prisma.user.delete({ where: { id: userId } });
  await writeAuditLog(actor.id, "DELETE_USER", `User:${userId}`);
  revalidatePath("/admin/users");
}
