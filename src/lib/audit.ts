import { prisma } from "./prisma";

export async function writeAuditLog(actorId: string, action: string, object: string, metadata?: unknown) {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      object,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });
}
