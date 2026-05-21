import { Router } from "express";
import { db } from "@workspace/db";
import { users } from "@workspace/db";
import { eq, isNull } from "drizzle-orm";
import { signToken, comparePassword, requireAdmin } from "../lib/auth.js";

const router = Router();

router.post("/v1/admin/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (!user || !user.isActive || user.deletedAt) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check lockout
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      res.status(429).json({ error: "Account temporarily locked. Try again later." });
      return;
    }

    const valid = await comparePassword(password, user.passwordHash);

    if (!valid) {
      const attempts = (user.loginAttempts ?? 0) + 1;
      const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

      await db
        .update(users)
        .set({
          loginAttempts: attempts,
          lockedUntil: lockedUntil,
        })
        .where(eq(users.id, user.id));

      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Reset attempts on success
    await db
      .update(users)
      .set({ loginAttempts: 0, lockedUntil: null, lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/auth/logout", (req, res) => {
  res.json({ ok: true });
});

router.get("/v1/admin/auth/me", requireAdmin, async (req, res) => {
  try {
    const admin = (req as typeof req & { admin: { id: string } }).admin;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, admin.id));

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isActive: user.isActive,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
