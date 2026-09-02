import PDFDocument from "pdfkit";
import type { Student } from "@prisma/client";

export function nextCertificateNumber(sequence: number): string {
  const year = new Date().getFullYear();
  return `GILS-${year}-${String(sequence).padStart(4, "0")}`;
}

export function generateCertificatePdf(student: Pick<Student, "fullName" | "level">, number: string) {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.fontSize(10).fillColor("#94a3b8").text("GIL'S ENGLISH TRAINING", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(28).fillColor("#0f172a").text("CERTIFICAT DE NIVEAU", { align: "center" });
  doc.moveDown(2);
  doc.fontSize(14).fillColor("#334155").text("Ce certificat est décerné à", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(22).fillColor("#f97316").text(student.fullName, { align: "center" });
  doc.moveDown(1);
  doc.fontSize(14).fillColor("#334155").text(`Niveau atteint : ${student.level ?? "-"}`, { align: "center" });
  doc.moveDown(3);
  doc.fontSize(11).fillColor("#64748b").text(`Référence : ${number}`, { align: "center" });
  doc.fontSize(11).fillColor("#64748b").text(`Délivré le ${new Date().toLocaleDateString("fr-FR")}`, { align: "center" });

  return doc;
}
