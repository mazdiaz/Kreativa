"use server";

import { revalidatePath } from "next/cache";

import { writeAuditLog } from "@/lib/audit";
import { requireRole } from "@/lib/authorization";
import { productStatusSchema } from "@/lib/forms";
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

export async function updateProductStatusAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const input = productStatusSchema.parse(values(formData));
  const product = await prisma.product.update({
    where: { id: input.productId },
    data: { status: input.status },
    include: { participant: true },
  });

  await writeAuditLog(actor.id, "UPDATE_PRODUCT_STATUS", `Product:${product.id}`, { status: input.status });
  await notifyUser(product.participant.userId, "Status produk diperbarui", `Produk ${product.name} sekarang berstatus ${input.status}.`);
  revalidatePath("/admin/products");
  revalidatePath("/showcase");
  revalidatePath("/partner");
  revalidatePath("/participant/products");
}

export async function deleteProductAction(formData: FormData) {
  const actor = await requireRole(["ADMIN"]);
  const productId = requiredId(formData, "productId");

  await prisma.product.delete({ where: { id: productId } });
  await writeAuditLog(actor.id, "DELETE_PRODUCT", `Product:${productId}`);
  revalidatePath("/admin/products");
  revalidatePath("/showcase");
  revalidatePath("/partner");
}
