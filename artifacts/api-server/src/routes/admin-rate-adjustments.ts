import { Router } from "express";
import { db } from "@workspace/db";
import { globalRateAdjustments } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

// Get all rate adjustments
router.get("/v1/admin/rate-adjustments", async (req, res) => {
  try {
    const adjustments = await db.select().from(globalRateAdjustments).orderBy(globalRateAdjustments.createdAt);
    res.json(adjustments);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new rate adjustment
router.post("/v1/admin/rate-adjustments", async (req, res) => {
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
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
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
router.put("/v1/admin/rate-adjustments/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        roomAdjustmentType,
        roomAdjustmentValue: roomAdjustmentValue?.toString(),
        experienceAdjustmentType,
        experienceAdjustmentValue: experienceAdjustmentValue?.toString(),
        packageAdjustmentType,
        packageAdjustmentValue: packageAdjustmentValue?.toString(),
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(globalRateAdjustments.id, id))
      .returning();

    if (!updated) {
      return res.status(404).json({ error: "Rate adjustment not found" });
    }

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a rate adjustment
router.delete("/v1/admin/rate-adjustments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [deleted] = await db
      .delete(globalRateAdjustments)
      .where(eq(globalRateAdjustments.id, id))
      .returning();

    if (!deleted) {
      return res.status(404).json({ error: "Rate adjustment not found" });
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
