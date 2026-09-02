import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAuth, requireRole } from "../middleware/auth";
import { logAction } from "../lib/audit";
import { generateCertificatePdf, nextCertificateNumber } from "../lib/certificate";

export const certificatesRouter = Router();

// Génère le certificat PDF d'un élève ACTIF. Réservé Boss/Staff.
certificatesRouter.post("/students/:id", requireAuth, requireRole("BOSS", "STAFF"), async (req, res) => {
  const student = await prisma.student.findUnique({ where: { id: req.params.id } });
  if (!student) return res.status(404).json({ error: "Élève introuvable" });
  if (student.status !== "ACTIVE") {
    return res.status(400).json({ error: "Le certificat ne peut être généré que pour un élève ACTIF" });
  }

  const count = await prisma.certificate.count();
  const number = nextCertificateNumber(count + 1);

  const certificate = await prisma.certificate.create({
    data: { number, studentId: student.id },
  });

  await logAction("CERTIFICATE_ISSUED", req.user!.email, student.id, { number });

  res.status(201).json(certificate);
});

certificatesRouter.get("/", requireAuth, requireRole("BOSS", "STAFF"), async (_req, res) => {
  const certificates = await prisma.certificate.findMany({
    include: { student: true },
    orderBy: { issuedAt: "desc" },
  });
  res.json(certificates);
});

// Téléchargement du PDF — public via le numéro (pensé pour être partagé/vérifié).
certificatesRouter.get("/:number/download", async (req, res) => {
  const certificate = await prisma.certificate.findUnique({
    where: { number: req.params.number },
    include: { student: true },
  });
  if (!certificate) return res.status(404).json({ error: "Certificat introuvable" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="${certificate.number}.pdf"`);

  const doc = generateCertificatePdf(certificate.student, certificate.number);
  doc.pipe(res);
  doc.end();
});
