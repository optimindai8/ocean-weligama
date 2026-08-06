import { Router } from "express";
import { db } from "@workspace/db";
import { globalRateAdjustments } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Get all rate adjustments
router.get("/v1/admin/rate-adjustments", requireAdmin, async (req, res) => {
  try {
    const adjustments = await db.select().from(globalRateAdjustments).orderBy(globalRateAdjustments.createdAt);
    
    // Auto-deactivate logic
    const now = new Date();
    const updatedAdjustments = await Promise.all(adjustments.map(async (adj) => {
      if (adj.isActive && adj.dateTo) {
        const toDate = new Date(adj.dateTo);
        if (now > toDate) {
          const [updated] = await db.update(globalRateAdjustments)
            .set({ isActive: false })
            .where(eq(globalRateAdjustments.id, adj.id))
            .returning();
          return updated;
        }
      }
      return adj;
    }));

    res.json(updatedAdjustments);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new rate adjustment
router.post("/v1/admin/rate-adjustments", requireAdmin, async (req, res) => {
  try {
    const {
      seasonName,
      dateFrom,
      dateTo,
      roomAdjustmentType,
      roomAdjustmentValue,
      experienceAdjustmentType,
      experienceAdjustmentValue,
      packageAdjustmentType,
      packageAdjustmentValue,
      isActive,
    } = req.body;

    const [adjustment] = await db
      .insert(globalRateAdjustments)
      .values({
        seasonName,
        dateFrom: dateFrom ? new Date(dateFrom) : null,
        dateTo: dateTo ? new Date(dateTo) : null,
        roomAdjustmentType: roomAdjustmentType || "fixed",
        roomAdjustmentValue: roomAdjustmentValue || "0",
        experienceAdjustmentType: experienceAdjustmentType || "fixed",
        experienceAdjustmentValue: experienceAdjustmentValue || "0",
        packageAdjustmentType: packageAdjustmentType || "fixed",
        packageAdjustmentValue: packageAdjustmentValue || "0",
        isActive: isActive || false,
      })
      .returning();

    res.status(201).json(adjustment);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a rate adjustment
router.put("/v1/admin/rate-adjustments/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const {
      seasonName,
      dateFrom,
      dateTo,
      roomAdjustmentType,
      roomAdjustmentValue,
      experienceAdjustmentType,
      experienceAdjustmentValue,
      packageAdjustmentType,
      packageAdjustmentValue,
      isActive,
    } = req.body;

    const [updated] = await db
      .update(globalRateAdjustments)
      .set({
        seasonName,
        dateFrom: dateFrom ? new Date(dateFrom) : null,
        dateTo: dateTo ? new Date(dateTo) : null,
        roomAdjustmentType: roomAdjustmentType || "fixed",
        roomAdjustmentValue: roomAdjustmentValue ? roomAdjustmentValue.toString() : "0",
        experienceAdjustmentType: experienceAdjustmentType || "fixed",
        experienceAdjustmentValue: experienceAdjustmentValue ? experienceAdjustmentValue.toString() : "0",
        packageAdjustmentType: packageAdjustmentType || "fixed",
        packageAdjustmentValue: packageAdjustmentValue ? packageAdjustmentValue.toString() : "0",
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(globalRateAdjustments.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Rate adjustment not found" });
    }

    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a rate adjustment
router.delete("/v1/admin/rate-adjustments/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const [deleted] = await db
      .delete(globalRateAdjustments)
      .where(eq(globalRateAdjustments.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Rate adjustment not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
