import { Router } from "express";
import { db } from "@workspace/db";
import { rooms, roomTranslations, amenities, roomAmenities } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

async function enrichRoom(roomId: string) {
  const [room] = await db.select().from(rooms).where(eq(rooms.id, roomId));
  if (!room) return null;

  const translations = await db
    .select()
    .from(roomTranslations)
    .where(eq(roomTranslations.roomId, roomId));

  const en = translations.find((t) => t.locale === "en") ?? translations[0];

  const ams = await db
    .select({ key: amenities.key })
    .from(roomAmenities)
    .innerJoin(amenities, eq(roomAmenities.amenityId, amenities.id))
    .where(eq(roomAmenities.roomId, roomId));

  return {
    ...room,
    name: en?.name ?? "",
    description: en?.description ?? "",
    shortDesc: en?.shortDesc ?? null,
    amenities: ams.map((a) => a.key),
  };
}

router.get("/v1/admin/rooms", requireAdmin, async (req, res) => {
  try {
    const allRooms = await db
      .select()
      .from(rooms)
      .where(isNull(rooms.deletedAt))
      .orderBy(rooms.sortOrder);

    const result = await Promise.all(allRooms.map((r) => enrichRoom(r.id)));
    res.json(result.filter(Boolean));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/rooms", requireAdmin, async (req, res) => {
  try {
    const {
      slug,
      type,
      maxGuests,
      bedrooms,
      bathrooms,
      sizeM2,
      basePricePerNight,
      cleaningFee,
      currency,
      isFeatured,
      heroImageUrl,
      name,
      description,
      category,
      gallery,
      highlights,
    } = req.body;

    const [room] = await db
      .insert(rooms)
      .values({
        slug,
        type,
        maxGuests,
        bedrooms,
        bathrooms,
        sizeM2,
        basePricePerNight,
        cleaningFee: cleaningFee ?? "0",
        currency: currency ?? "EUR",
        isFeatured: isFeatured ?? false,
        heroImageUrl,
        category: category ?? "solo",
        gallery: gallery ?? [],
        highlights: highlights ?? [],
      })
      .returning();

    await db.insert(roomTranslations).values({
      roomId: room.id,
      locale: "en",
      name,
      description,
    });

    const result = await enrichRoom(room.id);
    res.status(201).json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/rooms/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { name, description, ...roomFields } = req.body;

    await db
      .update(rooms)
      .set({ ...roomFields, updatedAt: new Date() })
      .where(and(eq(rooms.id, id), isNull(rooms.deletedAt)));

    if (name || description) {
      const existing = await db
        .select()
        .from(roomTranslations)
        .where(and(eq(roomTranslations.roomId, id), eq(roomTranslations.locale, "en")));

      if (existing.length > 0) {
        await db
          .update(roomTranslations)
          .set({
            name: name ?? existing[0].name,
            description: description ?? existing[0].description,
            updatedAt: new Date(),
          })
          .where(eq(roomTranslations.id, existing[0].id));
      }
    }

    const result = await enrichRoom(id);
    if (!result) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    res.json(result);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/rooms/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    await db
      .update(rooms)
      .set({ deletedAt: new Date() })
      .where(eq(rooms.id, id));

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
