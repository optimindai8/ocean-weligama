import { Router } from "express";
import { db } from "@workspace/db";
import {
  bookings,
  bookingServices,
  bookingRooms,
  rooms,
  services,
  roomTranslations,
  serviceTranslations,
} from "@workspace/db";
import { eq, and, isNull, desc, gte, lte, sql } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/v1/admin/bookings", requireAdmin, async (req, res) => {
  try {
    const {
      status,
      page = "1",
      limit = "20",
      dateFrom,
      dateTo,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [isNull(bookings.deletedAt)];
    if (status) conditions.push(eq(bookings.status, status as "pending" | "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show"));
    if (dateFrom) conditions.push(gte(bookings.checkIn, dateFrom));
    if (dateTo) conditions.push(lte(bookings.checkIn, dateTo));

    const allBookings = await db
      .select()
      .from(bookings)
      .where(and(...conditions))
      .orderBy(desc(bookings.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(...conditions));

    // Get room names
    const enriched = await Promise.all(
      allBookings.map(async (b) => {
        const bRooms = await db.select().from(bookingRooms).where(eq(bookingRooms.bookingId, b.id));
        const firstRoomId = bRooms[0]?.roomId ?? b.roomId ?? null;

        let primaryRoomName = "";
        if (firstRoomId) {
          const translations = await db
            .select()
            .from(roomTranslations)
            .where(and(eq(roomTranslations.roomId, firstRoomId), eq(roomTranslations.locale, "en")));
          primaryRoomName = translations[0]?.name ?? "";
        }

        const serviceRows = await db
          .select()
          .from(bookingServices)
          .where(eq(bookingServices.bookingId, b.id));

        const serviceList = await db.select().from(services);
        const stList = await db
          .select()
          .from(serviceTranslations)
          .where(eq(serviceTranslations.locale, "en"));

        return {
          ...b,
          roomName: primaryRoomName,
          services: serviceRows.map((sr) => ({
            id: sr.id,
            serviceId: sr.serviceId,
            serviceName: stList.find((st) => st.serviceId === sr.serviceId)?.name ??
              serviceList.find((s) => s.id === sr.serviceId)?.slug ?? "",
            quantity: sr.quantity,
            unitPrice: sr.unitPrice,
            subtotal: sr.subtotal,
          })),
        };
      })
    );

    res.json({
      bookings: enriched,
      total: Number(countResult?.count ?? 0),
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.id, id), isNull(bookings.deletedAt)));

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const bRooms = await db.select().from(bookingRooms).where(eq(bookingRooms.bookingId, booking.id));
    const firstRoomId = bRooms[0]?.roomId ?? booking.roomId ?? null;

    let primaryRoomName = "";
    if (firstRoomId) {
      const translations = await db
        .select()
        .from(roomTranslations)
        .where(and(eq(roomTranslations.roomId, firstRoomId), eq(roomTranslations.locale, "en")));
      primaryRoomName = translations[0]?.name ?? "";
    }

    const serviceRows = await db
      .select()
      .from(bookingServices)
      .where(eq(bookingServices.bookingId, booking.id));

    const serviceList = await db.select().from(services);

    res.json({
      ...booking,
      roomName: primaryRoomName,
      services: serviceRows.map((sr) => ({
        id: sr.id,
        serviceId: sr.serviceId,
        serviceName: serviceList.find((s) => s.id === sr.serviceId)?.slug ?? "",
        quantity: sr.quantity,
        unitPrice: sr.unitPrice,
        subtotal: sr.subtotal,
      })),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { status, paymentStatus, adminNotes, paymentMethod } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes;
    if (paymentMethod) updates.paymentMethod = paymentMethod;
    if (status === "cancelled") updates.cancelledAt = new Date();

    const [updated] = await db
      .update(bookings)
      .set(updates)
      .where(and(eq(bookings.id, id), isNull(bookings.deletedAt)))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.json({ ...updated, services: [] });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/bookings/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    await db
      .update(bookings)
      .set({ deletedAt: new Date() })
      .where(eq(bookings.id, id));

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
