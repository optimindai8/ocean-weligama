import { Router } from "express";
import { db } from "@workspace/db";
import {
  bookings,
  bookingServices,
  bookingRooms,
  rooms,
  services,
  availability,
  roomTranslations,
  serviceTranslations,
} from "@workspace/db";
import { eq, and, gte, lte, isNull, inArray } from "drizzle-orm";

const router = Router();

function generateReference(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `OW-${dateStr}-${random}`;
}

function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
}

router.post("/v1/bookings/check", async (req, res) => {
  try {
    const { roomId, roomIds: inputRoomIds, checkIn, checkOut, guestCount, serviceIds = [] } = req.body;
    const roomIdsArray = inputRoomIds && inputRoomIds.length > 0 ? inputRoomIds : (roomId ? [roomId] : []);

    if (roomIdsArray.length === 0) {
      res.status(400).json({ error: "No rooms provided" });
      return;
    }

    const selectedRooms = await db
      .select()
      .from(rooms)
      .where(and(inArray(rooms.id, roomIdsArray), isNull(rooms.deletedAt)));

    if (selectedRooms.length !== roomIdsArray.length) {
      res.status(404).json({ error: "One or more rooms not found" });
      return;
    }

    // Check availability
    const blockedDates = await db
      .select()
      .from(availability)
      .where(
        and(
          inArray(availability.roomId, roomIdsArray),
          eq(availability.isBlocked, true),
          gte(availability.date, checkIn),
          lte(availability.date, checkOut)
        )
      );

    // Also check existing confirmed bookings
    const conflictingBookings = await db
      .select()
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

    const nights = calculateNights(checkIn, checkOut);
    let totalRoomRate = 0;
    let cleaningFee = 0;
    
    for (const r of selectedRooms) {
      totalRoomRate += parseFloat(r.basePricePerNight);
      cleaningFee += parseFloat(r.cleaningFee ?? "0");
    }
    
    const roomSubtotal = totalRoomRate * nights;

    let servicesSubtotal = 0;
    if (serviceIds.length > 0) {
      const addons = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true));

      for (const sId of serviceIds) {
        const service = addons.find((s) => s.id === sId);
        if (service) {
          const price = parseFloat(service.basePrice);
          let qty = 1;
          if (service.unit === "per_person") {
            qty = guestCount;
          } else if (service.unit === "per_day") {
            qty = nights;
          }
          servicesSubtotal += price * qty;
        }
      }
    }

    const available = blockedDates.length === 0 && conflictingBookings.length === 0;

    res.json({
      available,
      roomRatePerNight: totalRoomRate.toFixed(2),
      nights,
      roomSubtotal: roomSubtotal.toFixed(2),
      servicesSubtotal: servicesSubtotal.toFixed(2),
      cleaningFee: cleaningFee.toFixed(2),
      totalAmount: (roomSubtotal + servicesSubtotal + cleaningFee).toFixed(2),
      currency: selectedRooms[0].currency,
      unavailableDates: blockedDates.map((b) => b.date),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/bookings", async (req, res) => {
  try {
    const {
      roomId,
      roomIds: inputRoomIds,
      checkIn,
      checkOut,
      guestCount,
      guestFullName,
      guestEmail,
      guestPhone,
      guestNationality,
      specialRequests,
      serviceIds = [],
      paymentMethod,
      languageUsed,
    } = req.body;
    const roomIdsArray = inputRoomIds && inputRoomIds.length > 0 ? inputRoomIds : (roomId ? [roomId] : []);

    if (roomIdsArray.length === 0) {
      res.status(400).json({ error: "No rooms provided" });
      return;
    }

    const selectedRooms = await db
      .select()
      .from(rooms)
      .where(and(inArray(rooms.id, roomIdsArray), isNull(rooms.deletedAt)));

    if (selectedRooms.length !== roomIdsArray.length) {
      res.status(404).json({ error: "One or more rooms not found" });
      return;
    }

    const nights = calculateNights(checkIn, checkOut);
    let totalRoomRate = 0;
    let cleaningFee = 0;
    
    for (const r of selectedRooms) {
      totalRoomRate += parseFloat(r.basePricePerNight);
      cleaningFee += parseFloat(r.cleaningFee ?? "0");
    }
    
    const roomSubtotal = totalRoomRate * nights;

    let servicesSubtotal = 0;
    const serviceDetails: Array<{
      serviceId: string;
      unitPrice: number;
      subtotal: number;
      quantity: number;
    }> = [];

    if (serviceIds.length > 0) {
      const addons = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true));

      for (const sId of serviceIds) {
        const service = addons.find((s) => s.id === sId);
        if (service) {
          const price = parseFloat(service.basePrice);
          let qty = 1;
          if (service.unit === "per_person") {
            qty = guestCount;
          } else if (service.unit === "per_day") {
            qty = nights;
          }
          const subtotal = price * qty;
          servicesSubtotal += subtotal;
          serviceDetails.push({
            serviceId: service.id,
            unitPrice: price,
            subtotal: subtotal,
            quantity: qty,
          });
        }
      }
    }

    const totalAmount = roomSubtotal + servicesSubtotal + cleaningFee;
    const reference = generateReference();

    const [booking] = await db
      .insert(bookings)
      .values({
        reference,
        roomId: roomIdsArray[0], // fallback for backward compatibility
        checkIn,
        checkOut,
        nights,
        guestCount,
        guestFullName,
        guestEmail,
        guestPhone,
        guestNationality,
        specialRequests,
        roomRatePerNight: totalRoomRate.toFixed(2),
        roomSubtotal: roomSubtotal.toFixed(2),
        servicesSubtotal: servicesSubtotal.toFixed(2),
        cleaningFee: cleaningFee.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        currency: selectedRooms[0].currency,
        depositAmount: "0",
        paymentMethod: paymentMethod ?? "pending",
        languageUsed: languageUsed ?? "en",
        status: "pending",
        paymentStatus: "unpaid",
      })
      .returning();
      
    // Insert into bookingRooms
    await db.insert(bookingRooms).values(
      roomIdsArray.map((rId: string) => ({
        bookingId: booking.id,
        roomId: rId,
      }))
    );

    if (serviceDetails.length > 0) {
      await db.insert(bookingServices).values(
        serviceDetails.map((sd) => ({
          bookingId: booking.id,
          serviceId: sd.serviceId,
          quantity: sd.quantity,
          unitPrice: sd.unitPrice.toFixed(2),
          subtotal: sd.subtotal.toFixed(2),
        }))
      );
    }

    // Block the dates in availability table
    const datesToBlock: string[] = [];
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      datesToBlock.push(d.toISOString().slice(0, 10));
    }

    if (datesToBlock.length > 0) {
      await db.insert(availability).values(
        datesToBlock.flatMap((date) => 
          roomIdsArray.map((rId: string) => ({
            roomId: rId,
            date,
            isBlocked: true,
            blockReason: "booked",
            bookingId: booking.id,
          }))
        )
      );
    }

    const serviceRows = await db
      .select()
      .from(bookingServices)
      .where(eq(bookingServices.bookingId, booking.id));

    const serviceNames = await db.select().from(services);

    res.status(201).json({
      ...booking,
      roomIds: roomIdsArray,
      services: serviceRows.map((sr) => ({
        id: sr.id,
        serviceId: sr.serviceId,
        serviceName:
          serviceNames.find((s) => s.id === sr.serviceId)?.slug ?? "",
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

router.get("/v1/bookings/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    const [booking] = await db
      .select()
      .from(bookings)
      .where(and(eq(bookings.reference, reference), isNull(bookings.deletedAt)));

    if (!booking) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    const bRooms = await db.select().from(bookingRooms).where(eq(bookingRooms.bookingId, booking.id));
    const rIds = bRooms.map(br => br.roomId);
    if (rIds.length === 0 && booking.roomId) {
      rIds.push(booking.roomId);
    }
    
    let primaryRoomName = "";
    if (rIds.length > 0) {
      const [room] = await db.select().from(rooms).where(eq(rooms.id, rIds[0]));
      const translations = await db
        .select()
        .from(roomTranslations)
        .where(and(eq(roomTranslations.roomId, rIds[0]), eq(roomTranslations.locale, "en")));
      primaryRoomName = translations[0]?.name ?? room?.slug ?? "";
    }
    // (Replaced above)

    const serviceRows = await db
      .select()
      .from(bookingServices)
      .where(eq(bookingServices.bookingId, booking.id));

    const serviceList = await db.select().from(services);
    const serviceTranslationList = await db
      .select()
      .from(serviceTranslations)
      .where(eq(serviceTranslations.locale, "en"));

    res.json({
      ...booking,
      roomIds: rIds,
      roomName: primaryRoomName,
      services: serviceRows.map((sr) => ({
        id: sr.id,
        serviceId: sr.serviceId,
        serviceName:
          serviceTranslationList.find((st) => st.serviceId === sr.serviceId)?.name ??
          serviceList.find((s) => s.id === sr.serviceId)?.slug ??
          "",
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

export default router;
