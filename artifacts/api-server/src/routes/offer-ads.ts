import { Router } from "express";
import { db } from "@workspace/db";
import { offerAds } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Helper: Check active ads and automatically deactivate any expired ones
async function deactivateExpiredAds() {
  try {
    const activeAdsList = await db
      .select()
      .from(offerAds)
      .where(eq(offerAds.isActive, true));

    const now = Date.now();
    for (const ad of activeAdsList) {
      const startTime = new Date(ad.createdAt).getTime();
      const offerDays = typeof ad.offerDays === "number" && ad.offerDays > 0 ? ad.offerDays : 7;
      const endTime = startTime + offerDays * 24 * 60 * 60 * 1000;
      if (now >= endTime) {
        await db
          .update(offerAds)
          .set({ isActive: false, updatedAt: new Date() })
          .where(eq(offerAds.id, ad.id));
      }
    }
  } catch (err) {
    console.error("Error deactivating expired offer ads:", err);
  }
}

// Public: get active offer ad
router.get("/v1/offer-ads/active", async (req, res) => {
  try {
    await deactivateExpiredAds();

    const [activeAd] = await db
      .select()
      .from(offerAds)
      .where(eq(offerAds.isActive, true))
      .orderBy(desc(offerAds.createdAt))
      .limit(1);

    if (!activeAd) {
      return res.status(200).json(null);
    }

    const startTime = new Date(activeAd.createdAt).getTime();
    const offerDays = typeof activeAd.offerDays === "number" && activeAd.offerDays > 0 ? activeAd.offerDays : 7;
    const endTime = startTime + offerDays * 24 * 60 * 60 * 1000;
    if (Date.now() >= endTime) {
      await db
        .update(offerAds)
        .set({ isActive: false, updatedAt: new Date() })
        .where(eq(offerAds.id, activeAd.id));
      return res.status(200).json(null);
    }

    return res.json(activeAd);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list all offer ads
router.get("/v1/admin/offer-ads", requireAdmin, async (req, res) => {
  try {
    await deactivateExpiredAds();

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
    const { title, description, imageUrl, isActive, intervalMinutes, offerDays, discountType, discountValue, roomIds } = req.body as {
      title: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
      intervalMinutes?: number;
      offerDays?: number;
      discountType?: string;
      discountValue?: string | number;
      roomIds?: string[];
    };

    if (!title) {
      return res.status(400).json({ error: "title is required" });
    }
    if (!roomIds || roomIds.length === 0) {
      return res.status(400).json({ error: "At least one room must be selected" });
    }

    const now = new Date();
    const [newAd] = await db
      .insert(offerAds)
      .values({ 
        title, 
        description: description || null, 
        imageUrl: imageUrl || null, 
        isActive: isActive !== undefined ? isActive : true, 
        intervalMinutes: intervalMinutes ?? 60,
        offerDays: offerDays ?? 7,
        discountType: discountType || "percentage",
        discountValue: discountValue ? String(discountValue) : "0",
        roomIds: roomIds,
        createdAt: now,
        updatedAt: now,
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
    const { title, description, imageUrl, isActive, intervalMinutes, offerDays, discountType, discountValue, roomIds } = req.body as {
      title?: string;
      description?: string;
      imageUrl?: string;
      isActive?: boolean;
      intervalMinutes?: number;
      offerDays?: number;
      discountType?: string;
      discountValue?: string | number;
      roomIds?: string[];
    };

    if (roomIds !== undefined && roomIds.length === 0) {
      return res.status(400).json({ error: "At least one room must be selected" });
    }

    const [existingAd] = await db
      .select()
      .from(offerAds)
      .where(eq(offerAds.id, id))
      .limit(1);

    if (!existingAd) {
      return res.status(404).json({ error: "Offer ad not found" });
    }

    const now = new Date();

    // Reset countdown start time (createdAt) if reactivating from false to true or if changing offerDays
    const isReactivating = isActive === true && !existingAd.isActive;
    const isDurationChanged = isActive !== false && offerDays !== undefined && offerDays !== existingAd.offerDays;
    const resetTimer = isReactivating || isDurationChanged;

    const updatePayload: Record<string, any> = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(isActive !== undefined && { isActive }),
      ...(intervalMinutes !== undefined && { intervalMinutes }),
      ...(offerDays !== undefined && { offerDays }),
      ...(discountType !== undefined && { discountType }),
      ...(discountValue !== undefined && { discountValue: String(discountValue) }),
      ...(roomIds !== undefined && { roomIds }),
      updatedAt: now,
    };

    if (resetTimer) {
      updatePayload.createdAt = now;
    }

    const [updated] = await db
      .update(offerAds)
      .set(updatePayload)
      .where(eq(offerAds.id, id))
      .returning();

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

