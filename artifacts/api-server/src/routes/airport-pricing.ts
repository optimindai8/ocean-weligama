import { Router } from "express";
import { db } from "@workspace/db";
import { airportPricing } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Helper to ensure a configuration row exists, and returns it
async function getOrCreatePricing() {
  const [existing] = await db.select().from(airportPricing).limit(1);
  if (existing) {
    return existing;
  }

  // Insert default row
  const [created] = await db
    .insert(airportPricing)
    .values({
      pickupPrice: "75.00",
      pickupPriceGroup: "100.00",
      dropPrice: "65.00",
      dropPriceGroup: "100.00",
      groupThreshold: 4,
    })
    .returning();

  return created;
}

// GET public /v1/airport-pricing
router.get("/v1/airport-pricing", async (req, res) => {
  try {
    const pricing = await getOrCreatePricing();
    res.json(pricing);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT admin /v1/admin/airport-pricing
router.put("/v1/admin/airport-pricing", requireAdmin, async (req, res) => {
  try {
    const body = req.body;
    const current = await getOrCreatePricing();

    const [updated] = await db
      .update(airportPricing)
      .set({
        pickupPrice: body.pickupPrice ?? current.pickupPrice,
        pickupPriceGroup: body.pickupPriceGroup ?? current.pickupPriceGroup,
        dropPrice: body.dropPrice ?? current.dropPrice,
        dropPriceGroup: body.dropPriceGroup ?? current.dropPriceGroup,
        groupThreshold: body.groupThreshold ?? current.groupThreshold,
        updatedAt: new Date(),
      })
      .where(eq(airportPricing.id, current.id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
