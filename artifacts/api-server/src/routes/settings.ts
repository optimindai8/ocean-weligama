import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettings } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Get setting value (Public)
router.get("/v1/settings/:key", async (req, res) => {
  try {
    const { key } = req.params as Record<string, string>;
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    
    return res.json(setting);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update setting (Admin)
router.patch("/v1/admin/settings/:key", requireAdmin, async (req, res) => {
  try {
    const { key } = req.params as Record<string, string>;
    const { value } = req.body;
    
    // Upsert the setting
    const [setting] = await db.insert(siteSettings).values({
      key,
      value,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value, updatedAt: new Date() },
    }).returning();
    
    return res.json(setting);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
