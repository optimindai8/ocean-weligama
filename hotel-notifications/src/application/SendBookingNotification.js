import { Booking } from '../domain/booking/Booking.js';
import { todayInZone } from '../domain/shared/dates.js';

/** Use case: validate a booking request, price it, and notify the hotel by email. */
export class SendBookingNotification {
  #gateway;
  #rooms;
  #timeZone;
  #referenceGenerator;
  #clock;

  constructor({ notificationGateway, rooms, timeZone, referenceGenerator, clock = () => new Date() }) {
    this.#gateway = notificationGateway;
    this.#rooms = rooms;
    this.#timeZone = timeZone;
    this.#referenceGenerator = referenceGenerator;
    this.#clock = clock;
  }

  /**
   * @returns {Promise<{ reference: string, totalPrice: number }>}
   * @throws {import('../domain/shared/errors.js').ValidationError} when the input is invalid
   */
  async execute(input) {
    const now = this.#clock();
    const booking = Booking.create(input, {
      rooms: this.#rooms,
      today: todayInZone(now, this.#timeZone),
      reference: this.#referenceGenerator(now),
    });

    await this.#gateway.sendBookingNotification(booking, now);
    return { reference: booking.reference, totalPrice: booking.totalPrice };
  }
}
