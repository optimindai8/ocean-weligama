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
  roomPackagePrices,
  globalRateAdjustments,
} from "@workspace/db";
import { eq, and, gte, lte, lt, gt, isNull, inArray } from "drizzle-orm";

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

function applyRateAdjustment(price: number, entityType: "room" | "package" | "experience", adjustment: any) {
  if (!adjustment) return price;
  
  let type = "fixed";
  let val = 0;
  
  if (entityType === "room") {
    type = adjustment.roomAdjustmentType || "fixed";
    val = parseFloat(adjustment.roomAdjustmentValue || "0");
  } else if (entityType === "package") {
    type = adjustment.packageAdjustmentType || "fixed";
    val = parseFloat(adjustment.packageAdjustmentValue || "0");
  } else if (entityType === "experience") {
    type = adjustment.experienceAdjustmentType || "fixed";
    val = parseFloat(adjustment.experienceAdjustmentValue || "0");
  }
  
  if (val === 0) return price;
  
  if (type === "percentage") {
    return price + (price * val) / 100;
  }
  return price + val;
}

router.post("/v1/bookings/check", async (req, res) => {
  try {
    const { roomId, roomIds: inputRoomIds, checkIn, checkOut, guestCount, serviceIds = [], serviceQuantities = {}, airportPickupPrice = 0, airportDropPrice = 0, isMatrixBooking = false } = req.body;
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
          lt(availability.date, checkOut)
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
          lt(bookings.checkIn, checkOut),
          gt(bookings.checkOut, checkIn)
        )
      );

    const nights = calculateNights(checkIn, checkOut);
    let totalRoomRate = 0;
    let cleaningFee = 0;
    
    const adjustments = await db.select().from(globalRateAdjustments).where(eq(globalRateAdjustments.isActive, true));
    let applicableAdjustment = null;
    if (adjustments.length > 0) {
      applicableAdjustment = adjustments.find(adj => {
        if (!adj.dateFrom || !adj.dateTo) return true;
        const from = new Date(adj.dateFrom);
        const to = new Date(adj.dateTo);
        const checkInDate = new Date(checkIn);
        return checkInDate >= from && checkInDate <= to;
      }) || adjustments.find(adj => !adj.dateFrom && !adj.dateTo) || null;
    }

    for (const r of selectedRooms) {
      let roomPrice = parseFloat(r.basePricePerNight);
      roomPrice = applyRateAdjustment(roomPrice, "room", applicableAdjustment);
      totalRoomRate += roomPrice;
      cleaningFee += parseFloat(r.cleaningFee ?? "0");
    }
    
    let roomSubtotal = totalRoomRate * nights;

    let servicesSubtotal = 0;
    if (serviceIds.length > 0) {
      const addons = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true));

      const { serviceCustomizations = {} } = req.body;

      const matrixPrices = await db
        .select()
        .from(roomPackagePrices)
        .where(inArray(roomPackagePrices.roomId, roomIdsArray));

      for (const sId of serviceIds) {
        const service = addons.find((s) => s.id === sId);
        if (service) {
          // Check for matrix price (for the primary room)
          const matrixPrice = matrixPrices.find(m => m.packageId === sId && m.roomId === roomIdsArray[0]);
          // Note: The matrix price is an inclusive daily price (Room + Package). 
          // So the package addon price is (Matrix Daily Price - Room Base Price).
          let price = parseFloat(service.basePrice);
          const isPackage = service.type === "main" || (service.category || "").toLowerCase().includes("package");
          const entityType = isPackage ? "package" : "experience";

          if (matrixPrice && service.type === "main") {
            if (isMatrixBooking) {
              let mPrice = parseFloat(matrixPrice.dailyPrice);
              mPrice = applyRateAdjustment(mPrice, "package", applicableAdjustment);
              price = mPrice;
              const roomBase = parseFloat(selectedRooms[0].basePricePerNight);
              totalRoomRate -= applyRateAdjustment(roomBase, "room", applicableAdjustment);
              roomSubtotal = totalRoomRate * nights;
            } else {
              const roomBase = parseFloat(selectedRooms[0].basePricePerNight);
              price = parseFloat(matrixPrice.dailyPrice) - roomBase;
              if (price < 0) price = 0;
              price = applyRateAdjustment(price, "package", applicableAdjustment);
            }
          } else {
            price = applyRateAdjustment(price, entityType, applicableAdjustment);
          }
          let qty = 1;
          if (matrixPrice && service.type === "main") {
            qty = nights / 7;
          } else if (serviceQuantities && typeof serviceQuantities[sId] === "number") {
            qty = serviceQuantities[sId];
          } else if (service.unit === "per_person") {
            qty = guestCount;
          } else if (service.unit === "per_day") {
            qty = nights;
          }

          let extraLessons = 0;
          let extraSessions = 0;
          let extraCost = 0;

          if (serviceCustomizations[sId]) {
            extraLessons = serviceCustomizations[sId].extraLessons || 0;
            extraSessions = serviceCustomizations[sId].extraSessions || 0;
            
            extraCost = 0;
          }

          servicesSubtotal += (price * qty) + extraCost;
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
      airportPickupPrice: Number(airportPickupPrice).toFixed(2),
      airportDropPrice: Number(airportDropPrice).toFixed(2),
      totalAmount: (roomSubtotal + servicesSubtotal + cleaningFee + Number(airportPickupPrice) + Number(airportDropPrice)).toFixed(2),
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
      serviceQuantities = {},
      paymentMethod,
      languageUsed,
      airportPickup,
      airportDrop,
      airportPickupPrice = 0,
      airportDropPrice = 0,
      flightDetails,
      isMatrixBooking = false,
    } = req.body;
    const roomIdsArray = inputRoomIds && inputRoomIds.length > 0 ? inputRoomIds : (roomId ? [roomId] : []);

    if (guestCount > 3 && (airportPickup || airportDrop)) {
      res.status(400).json({ error: "Airport pickup and drop are limited to up to 3 people." });
      return;
    }

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
    
    const adjustments = await db.select().from(globalRateAdjustments).where(eq(globalRateAdjustments.isActive, true));
    let applicableAdjustment = null;
    if (adjustments.length > 0) {
      applicableAdjustment = adjustments.find(adj => {
        if (!adj.dateFrom || !adj.dateTo) return true;
        const from = new Date(adj.dateFrom);
        const to = new Date(adj.dateTo);
        const checkInDate = new Date(checkIn);
        return checkInDate >= from && checkInDate <= to;
      }) || adjustments.find(adj => !adj.dateFrom && !adj.dateTo) || null;
    }

    for (const r of selectedRooms) {
      let roomPrice = parseFloat(r.basePricePerNight);
      roomPrice = applyRateAdjustment(roomPrice, "room", applicableAdjustment);
      totalRoomRate += roomPrice;
      cleaningFee += parseFloat(r.cleaningFee ?? "0");
    }
    
    let roomSubtotal = totalRoomRate * nights;

    let servicesSubtotal = 0;
    const serviceDetails: Array<{
      serviceId: string;
      unitPrice: number;
      subtotal: number;
      quantity: number;
      extraLessons: number;
      extraSessions: number;
    }> = [];

    if (serviceIds.length > 0) {
      const addons = await db
        .select()
        .from(services)
        .where(eq(services.isActive, true));

      const matrixPrices = await db
        .select()
        .from(roomPackagePrices)
        .where(inArray(roomPackagePrices.roomId, roomIdsArray));

      const { serviceCustomizations = {} } = req.body;

      for (const sId of serviceIds) {
        const service = addons.find((s) => s.id === sId);
        if (service) {
          // Check for matrix price
          const matrixPrice = matrixPrices.find(m => m.packageId === sId && m.roomId === roomIdsArray[0]);
          let price = parseFloat(service.basePrice);
          const isPackage = service.type === "main" || (service.category || "").toLowerCase().includes("package");
          const entityType = isPackage ? "package" : "experience";

          if (matrixPrice && service.type === "main") {
            if (isMatrixBooking) {
              let mPrice = parseFloat(matrixPrice.dailyPrice);
              mPrice = applyRateAdjustment(mPrice, "package", applicableAdjustment);
              price = mPrice;
              const roomBase = parseFloat(selectedRooms[0].basePricePerNight);
              totalRoomRate -= applyRateAdjustment(roomBase, "room", applicableAdjustment);
              roomSubtotal = totalRoomRate * nights;
            } else {
              const roomBase = parseFloat(selectedRooms[0].basePricePerNight);
              price = parseFloat(matrixPrice.dailyPrice) - roomBase;
              if (price < 0) price = 0;
              price = applyRateAdjustment(price, "package", applicableAdjustment);
            }
          } else {
            price = applyRateAdjustment(price, entityType, applicableAdjustment);
          }
          let qty = 1;
          if (matrixPrice && service.type === "main") {
            qty = nights / 7;
          } else if (serviceQuantities && typeof serviceQuantities[sId] === "number") {
            qty = serviceQuantities[sId];
          } else if (service.unit === "per_person") {
            qty = guestCount;
          } else if (service.unit === "per_day") {
            qty = nights;
          }
          
          let extraLessons = 0;
          let extraSessions = 0;
          let extraCost = 0;

          if (serviceCustomizations[sId]) {
            extraLessons = serviceCustomizations[sId].extraLessons || 0;
            extraSessions = serviceCustomizations[sId].extraSessions || 0;
            
            extraCost = 0;
          }

          const subtotal = (price * qty) + extraCost;
          servicesSubtotal += subtotal;
          serviceDetails.push({
            serviceId: service.id,
            unitPrice: price,
            subtotal: subtotal,
            quantity: qty,
            extraLessons,
            extraSessions,
          });
        }
      }
    }

    const totalAmount = roomSubtotal + servicesSubtotal + cleaningFee + Number(airportPickupPrice) + Number(airportDropPrice);
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
        airportPickup: Boolean(airportPickup),
        airportDrop: Boolean(airportDrop),
        airportPickupPrice: Number(airportPickupPrice).toFixed(2),
        airportDropPrice: Number(airportDropPrice).toFixed(2),
        flightDetails,
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
          extraLessons: sd.extraLessons,
          extraSessions: sd.extraSessions,
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
