import { calculateTotal, countNights } from '../domain/booking/pricing.js';

/** Use case: live price preview shown on the booking form (no email is sent). */
export class GetBookingQuote {
  #rooms;

  constructor({ rooms }) {
    this.#rooms = rooms;
  }

  /** Returns null until the room and a valid date range are chosen. */
  execute({ roomId, checkIn, checkOut }) {
    const room = this.#rooms.find((candidate) => candidate.id === roomId);
    const nights = countNights(checkIn, checkOut);
    if (!room || nights < 1) return null;

    return {
      roomName: room.name,
      nights,
      pricePerNight: room.pricePerNight,
      totalPrice: calculateTotal(room, nights),
    };
  }
}
