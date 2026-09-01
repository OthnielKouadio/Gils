import "dotenv/config";
import express from "express";
import cors from "cors";
import { studentsRouter } from "./routes/students";
import { paymentsRouter } from "./routes/payments";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/students", studentsRouter);
app.use("/api/payments", paymentsRouter);

const PORT = Number(process.env.PORT ?? 4000);
app.listen(PORT, () => {
  console.log(`Gil's backend API démarré sur http://localhost:${PORT}`);
});
