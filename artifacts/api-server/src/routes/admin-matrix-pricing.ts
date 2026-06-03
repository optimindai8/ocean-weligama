import { Router } from "express";
import { db } from "@workspace/db";
import { rooms, services, roomPackagePrices, roomTranslations, serviceTranslations } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Get the full matrix data
router.get("/v1/admin/matrix-pricing", requireAdmin, async (req, res) => {
  try {
    const allRooms = await db
      .select({ id: rooms.id, name: rooms.slug, maxGuests: rooms.maxGuests, type: rooms.type }) 
      .from(rooms)
      .where(isNull(rooms.deletedAt))
      .orderBy(rooms.sortOrder);

    // Fetch translations for better names
    const rTranslations = await db.select().from(roomTranslations).where(eq(roomTranslations.locale, "en"));
    const roomsMap = allRooms.map(r => {
      const t = rTranslations.find(tr => tr.roomId === r.id);
      return { id: r.id, name: t?.name ?? r.name, maxGuests: r.maxGuests, type: r.type };
    });

    const sTranslations = await db.select().from(serviceTranslations).where(eq(serviceTranslations.locale, "en"));

    const packagesRecords = await db
      .select({ id: services.id, slug: services.slug })
      .from(services)
      .where(and(eq(services.type, "main"), eq(services.isActive, true)))
      .orderBy(services.sortOrder);
      
    const mainPackages = packagesRecords.map(p => {
      const t = sTranslations.find(tr => tr.serviceId === p.id);
      return { id: p.id, name: t?.name ?? p.slug, slug: p.slug };
    });

    const prices = await db.select().from(roomPackagePrices);

    res.json({
      rooms: roomsMap,
      packages: mainPackages,
      prices: prices,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a specific matrix price
router.patch("/v1/admin/matrix-pricing", requireAdmin, async (req, res) => {
  try {
    const { roomId, packageId, price, dailyPrice } = req.body;

    if (!roomId || !packageId || price === undefined || dailyPrice === undefined) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existing = await db
      .select()
      .from(roomPackagePrices)
      .where(and(eq(roomPackagePrices.roomId, roomId), eq(roomPackagePrices.packageId, packageId)));

    if (existing.length > 0) {
      await db
        .update(roomPackagePrices)
        .set({ price: price.toString(), dailyPrice: dailyPrice.toString(), updatedAt: new Date() })
        .where(and(eq(roomPackagePrices.roomId, roomId), eq(roomPackagePrices.packageId, packageId)));
    } else {
      await db.insert(roomPackagePrices).values({
        roomId,
        packageId,
        price: price.toString(),
        dailyPrice: dailyPrice.toString(),
      });
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
