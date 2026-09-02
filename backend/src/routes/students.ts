import { Router } from "express";
import { prisma } from "../lib/prisma";
import { INSCRIPTION_FEE, levelFromTotal, randomToken } from "../lib/payment";
import { logAction } from "../lib/audit";
import { requireAuth, requireRole } from "../middleware/auth";

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
  await logAction("STUDENT_CREATED", "public", student.id, { fullName });
  res.status(201).json(student);
});

// Liste complète — réservée Boss/Staff (EleveController CRUD).
studentsRouter.get("/", requireAuth, requireRole("BOSS", "STAFF"), async (_req, res) => {
  const students = await prisma.student.findMany({ orderBy: { createdAt: "desc" } });
  res.json(students);
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

  await logAction("TEST_SUBMITTED", "public", student.id, { totalScore, level });

  res.json({ student, paymentLink });
});

// Mise à jour manuelle (niveau, coordonnées) — Boss/Staff.
studentsRouter.put("/:id", requireAuth, requireRole("BOSS", "STAFF"), async (req, res) => {
  const { fullName, whatsapp, level, status } = req.body ?? {};
  const student = await prisma.student.update({
    where: { id: req.params.id },
    data: {
      ...(fullName !== undefined && { fullName }),
      ...(whatsapp !== undefined && { whatsapp }),
      ...(level !== undefined && { level }),
      ...(status !== undefined && { status }),
    },
  });
  await logAction("STUDENT_UPDATED", req.user!.email, student.id, req.body);
  res.json(student);
});

studentsRouter.delete("/:id", requireAuth, requireRole("BOSS", "STAFF"), async (req, res) => {
  await prisma.student.delete({ where: { id: req.params.id } });
  await logAction("STUDENT_DELETED", req.user!.email, req.params.id);
  res.status(204).send();
});
