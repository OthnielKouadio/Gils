import { prisma } from "./prisma";

export function logAction(action: string, actor: string, targetId?: string, metadata?: Record<string, unknown>) {
  return prisma.auditLog.create({
    data: {
      action,
      actor,
      targetId,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
    },
  });
}
