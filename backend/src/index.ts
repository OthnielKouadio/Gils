import "dotenv/config";
import express from "express";
import cors from "cors";
import { studentsRouter } from "./routes/students";
import { paymentsRouter } from "./routes/payments";
import { authRouter } from "./routes/auth";
import { certificatesRouter } from "./routes/certificates";
import { auditRouter } from "./routes/audit";
import { startSubscriptionCron } from "./lib/cron";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/certificates", certificatesRouter);
app.use("/api/audit", auditRouter);

startSubscriptionCron();

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`Gil's backend API démarré sur http://localhost:${PORT}`);
});
