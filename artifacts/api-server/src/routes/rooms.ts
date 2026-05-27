import { Router } from "express";
import { db } from "@workspace/db";
import {
  rooms,
  roomTranslations,
  amenities,
  roomAmenities,
  availability,
  gallery,
  bookings,
  bookingRooms,
} from "@workspace/db";
import { eq, and, isNull, gte, lte, sql, inArray } from "drizzle-orm";

const router = Router();

async function getRoomWithTranslation(roomId: string, locale: string) {
  const [room] = await db
    .select()
    .from(rooms)
    .where(and(eq(rooms.id, roomId), isNull(rooms.deletedAt)));

  if (!room) return null;

  const translations = await db
    .select()
    .from(roomTranslations)
    .where(eq(roomTranslations.roomId, roomId));

  const translation =
    translations.find((t) => t.locale === locale) ??
    translations.find((t) => t.locale === "en") ??
    translations[0];

  const roomAmenitiesData = await db
    .select({ key: amenities.key })
    .from(roomAmenities)
    .innerJoin(amenities, eq(roomAmenities.amenityId, amenities.id))
    .where(eq(roomAmenities.roomId, roomId));

  return {
    ...room,
    name: translation?.name ?? "",
    description: translation?.description ?? "",
    shortDesc: translation?.shortDesc ?? null,
    amenities: roomAmenitiesData.map((a) => a.key),
  };
}

router.get("/v1/rooms", async (req, res) => {
  try {
    const { type, locale = "en", checkIn, checkOut } = req.query as Record<string, string>;

    const conditions = [isNull(rooms.deletedAt), eq(rooms.status, "active")];
    if (type) conditions.push(eq(rooms.type, type as "room" | "villa" | "dormitory" | "suite"));

    let allRooms = await db
      .select()
      .from(rooms)
      .where(and(...conditions))
      .orderBy(rooms.sortOrder);

    if (checkIn && checkOut && allRooms.length > 0) {
      const roomIdsArray = allRooms.map((r) => r.id);

      const blockedDates = await db
        .select({ roomId: availability.roomId })
        .from(availability)
        .where(
          and(
            inArray(availability.roomId, roomIdsArray),
            eq(availability.isBlocked, true),
            gte(availability.date, checkIn),
            lte(availability.date, checkOut)
          )
        );

      const conflictingBookings = await db
        .select({ roomId: bookingRooms.roomId })
        .from(bookings)
        .innerJoin(bookingRooms, eq(bookings.id, bookingRooms.bookingId))
        .where(
          and(
            inArray(bookingRooms.roomId, roomIdsArray),
            isNull(bookings.deletedAt),
            lte(bookings.checkIn, checkOut),
            gte(bookings.checkOut, checkIn)
          )
        );

      const unavailableRoomIds = new Set([
        ...blockedDates.map((b) => b.roomId),
        ...conflictingBookings.map((b) => b.roomId),
      ]);

      allRooms = allRooms.filter((r) => !unavailableRoomIds.has(r.id));
    }

    const result = await Promise.all(
      allRooms.map((room) => getRoomWithTranslation(room.id, locale))
    );

    res.json(result.filter(Boolean));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/rooms/featured", async (req, res) => {
  try {
    const { locale = "en" } = req.query as Record<string, string>;

    const featuredRooms = await db
      .select()
      .from(rooms)
      .where(
        and(
          isNull(rooms.deletedAt),
          eq(rooms.status, "active"),
          eq(rooms.isFeatured, true)
        )
      )
      .orderBy(rooms.sortOrder)
      .limit(3);

    const result = await Promise.all(
      featuredRooms.map((room) => getRoomWithTranslation(room.id, locale))
    );

    res.json(result.filter(Boolean));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/rooms/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { locale = "en" } = req.query as Record<string, string>;

    const [room] = await db
      .select()
      .from(rooms)
      .where(and(eq(rooms.slug, slug), isNull(rooms.deletedAt)));

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const roomData = await getRoomWithTranslation(room.id, locale);

    const images = await db
      .select()
      .from(gallery)
      .where(and(eq(gallery.roomId, room.id), isNull(gallery.deletedAt)))
      .orderBy(gallery.sortOrder);

    const relatedRoomsRaw = await db
      .select()
      .from(rooms)
      .where(
        and(
          isNull(rooms.deletedAt),
          eq(rooms.status, "active"),
          sql`${rooms.id} != ${room.id}`
        )
      )
      .limit(3);

    const relatedRooms = await Promise.all(
      relatedRoomsRaw.map((r) => getRoomWithTranslation(r.id, locale))
    );

    res.json({
      ...roomData,
      images: images.map((img) => ({
        id: img.id,
        mediaType: img.mediaType,
        url: img.url,
        thumbnailUrl: img.thumbnailUrl,
        altText: img.altText,
        caption: img.caption,
        category: img.category,
        isFeatured: img.isFeatured,
      })),
      relatedRooms: relatedRooms.filter(Boolean),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/rooms/:slug/availability", async (req, res) => {
  try {
    const { slug } = req.params;
    const { from, to } = req.query as Record<string, string>;

    const [room] = await db
      .select()
      .from(rooms)
      .where(and(eq(rooms.slug, slug), isNull(rooms.deletedAt)));

    if (!room) {
      res.status(404).json({ error: "Room not found" });
      return;
    }

    const conditions = [eq(availability.roomId, room.id)];
    if (from) conditions.push(gte(availability.date, from));
    if (to) conditions.push(lte(availability.date, to));

    const avail = await db
      .select()
      .from(availability)
      .where(and(...conditions));

    res.json(
      avail.map((a) => ({
        date: a.date,
        isBlocked: a.isBlocked,
        blockReason: a.blockReason,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
