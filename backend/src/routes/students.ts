import { Router } from "express";
import { prisma } from "../lib/prisma";
import { INSCRIPTION_FEE, levelFromTotal, randomToken } from "../lib/payment";

export const studentsRouter = Router();

// Étape A : inscription (nom + whatsapp) -> crée l'élève en statut PENDING_TEST
studentsRouter.post("/", async (req, res) => {
  const { fullName, whatsapp } = req.body ?? {};
  if (!fullName || !whatsapp) {
    return res.status(400).json({ error: "fullName et whatsapp sont requis" });
  }
  const student = await prisma.student.create({
    data: { fullName, whatsapp, status: "PENDING_TEST" },
  });
  res.status(201).json(student);
});

studentsRouter.get("/:id", async (req, res) => {
  const student = await prisma.student.findUnique({
    where: { id: req.params.id },
    include: { paymentLink: true },
  });
  if (!student) return res.status(404).json({ error: "Élève introuvable" });
  res.json(student);
});

// Étape C : soumission du résultat du test -> calcule le niveau + crée le lien de paiement
studentsRouter.post("/:id/test-result", async (req, res) => {
  const { grammarScore, topicScore, audioScore } = req.body ?? {};
  if ([grammarScore, topicScore, audioScore].some((v) => typeof v !== "number")) {
    return res.status(400).json({ error: "grammarScore, topicScore, audioScore (nombres) sont requis" });
  }

  const totalScore = grammarScore + topicScore + audioScore;
  const level = levelFromTotal(totalScore);

  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: { grammarScore, topicScore, audioScore, totalScore, level, status: "PENDING_PAYMENT" },
  });

  const paymentLink = await prisma.paymentLink.upsert({
    where: { studentId: student.id },
    update: { status: "PENDING", amount: INSCRIPTION_FEE, studentName: student.fullName },
    create: {
      token: randomToken(),
      studentId: student.id,
      studentName: student.fullName,
      amount: INSCRIPTION_FEE,
      status: "PENDING",
    },
  });

  res.json({ student, paymentLink });
});

studentsRouter.get("/", async (_req, res) => {
  const students = await prisma.student.findMany({ orderBy: { createdAt: "desc" } });
  res.json(students);
});
