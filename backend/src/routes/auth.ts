import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { signToken } from "../lib/jwt";
import { logAction } from "../lib/audit";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

// Module Auth d'OTK : login + rôles.
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "email et password sont requis" });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  const valid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !valid) {
    await logAction("LOGIN_FAILED", email);
    return res.status(401).json({ error: "Email ou mot de passe incorrect" });
  }

  const token = signToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "BOSS" | "STAFF",
  });

  await logAction("LOGIN_SUCCESS", user.email);

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});
