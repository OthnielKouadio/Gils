import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";

export const auditRouter = Router();

// Piste Audit — Boss Logs, réservé au rôle Boss.
auditRouter.get("/", requireAuth, requireRole("BOSS"), async (_req, res) => {
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  res.json(logs);
});
