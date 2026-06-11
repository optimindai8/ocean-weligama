import { Router } from "express";
import { db } from "@workspace/db";
import { offerAds } from "@workspace/db";
import { eq, asc, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Public: get active offer ad
router.get("/v1/offer-ads/active", async (req, res) => {
  try {
    const [activeAd] = await db
      .select()
      .from(offerAds)
      .where(eq(offerAds.isActive, true))
      .orderBy(desc(offerAds.createdAt))
      .limit(1);

    if (!activeAd) {
      return res.status(200).json(null);
    }

    res.json(activeAd);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list all offer ads
router.get("/v1/admin/offer-ads", requireAdmin, async (req, res) => {
  try {
    const items = await db
      .select()
      .from(offerAds)
      .orderBy(desc(offerAds.createdAt));

    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: create offer ad
router.post("/v1/admin/offer-ads", requireAdmin, async (req, res) => {
  try {
    const { title, description, imageUrl, isActive, intervalMinutes } = req.body as {
      title: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
      intervalMinutes?: number;
    };

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }

    const [newAd] = await db
      .insert(offerAds)
      .values({ 
        title, 
        description: description || null, 
        imageUrl: imageUrl || null, 
        isActive: isActive !== undefined ? isActive : true, 
        intervalMinutes: intervalMinutes ?? 60 
      })
      .returning();

    return res.status(201).json(newAd);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update offer ad
router.patch("/v1/admin/offer-ads/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { title, description, imageUrl, isActive, intervalMinutes } = req.body as {
      title?: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
      intervalMinutes?: number;
    };

    const [updated] = await db
      .update(offerAds)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
        ...(intervalMinutes !== undefined && { intervalMinutes }),
        updatedAt: new Date(),
      })
      .where(eq(offerAds.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "Offer ad not found" });

    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete offer ad (hard delete)
router.delete("/v1/admin/offer-ads/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [deleted] = await db
      .delete(offerAds)
      .where(eq(offerAds.id, id))
      .returning();

    if (!deleted) return res.status(404).json({ error: "Offer ad not found" });

    return res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
