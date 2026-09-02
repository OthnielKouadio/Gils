import { Router } from "express";
import { prisma } from "../lib/prisma";
import { logAction } from "../lib/audit";

export const paymentsRouter = Router();

paymentsRouter.get("/:token", async (req, res) => {
  const link = await prisma.paymentLink.findUnique({
    where: { token: req.params.token },
    include: { student: true },
  });
  if (!link) return res.status(404).json({ error: "Lien de paiement introuvable" });
  res.json(link);
});

// Paiement simulé (mock Wave/CinetPay) en attendant les vraies clés marchand + le webhook réel.
paymentsRouter.post("/:token/pay", async (req, res) => {
  const link = await prisma.paymentLink.findUnique({ where: { token: req.params.token } });
  if (!link) return res.status(404).json({ error: "Lien de paiement introuvable" });

  const updatedLink = await prisma.paymentLink.update({
    where: { token: req.params.token },
    data: { status: "PAID" },
  });
  const student = await prisma.student.update({
    where: { id: link.studentId },
    data: { status: "ACTIVE" },
  });

  await logAction("PAYMENT_CONFIRMED", "public", student.id, { token: req.params.token, amount: link.amount });

  res.json({ paymentLink: updatedLink, student });
});

// Stub pour le futur webhook CinetPay réel (signature à vérifier une fois les clés marchand dispo).
paymentsRouter.post("/webhook/cinetpay", async (_req, res) => {
  res.status(501).json({ error: "Webhook CinetPay non branché - clés marchand à venir" });
});
