import { ValidationError } from '../shared/errors.js';
import { clean, cleanMultiline, isEmail, isPhone } from '../shared/validators.js';
import { parseIsoDate } from '../shared/dates.js';
import { calculateTotal, countNights } from './pricing.js';

const MAX_NIGHTS = 60;
const MAX_NOTES = 1000;

export class Booking {
  constructor(props) {
    Object.assign(this, props);
    Object.freeze(this);
  }

  /**
   * Validates raw form input against the room catalogue and returns an immutable Booking.
   * @param {object} input raw form values
   * @param {{ rooms: Array, today: string, reference: string }} context
   */
  static create(input, { rooms, today, reference }) {
    const data = {
      name: clean(input.name),
      email: clean(input.email).toLowerCase(),
      phone: clean(input.phone),
      roomId: clean(input.roomId),
      checkIn: clean(input.checkIn),
      checkOut: clean(input.checkOut),
      guests: Number.parseInt(input.guests, 10),
      notes: cleanMultiline(input.notes),
    };

    const room = rooms.find((candidate) => candidate.id === data.roomId);
    const checkInValid = !Number.isNaN(parseIsoDate(data.checkIn));
    const checkOutValid = !Number.isNaN(parseIsoDate(data.checkOut));
    const nights = countNights(data.checkIn, data.checkOut);

    const errors = {};
    if (data.name.length < 2) errors.name = 'Please enter the guest name.';
    if (!isEmail(data.email)) errors.email = 'Please enter a valid email address.';
    if (!isPhone(data.phone)) errors.phone = 'Please enter a valid phone number.';
    if (!room) errors.roomId = 'Please select a room type.';

    if (!checkInValid) errors.checkIn = 'Please choose a check-in date.';
    else if (data.checkIn < today) errors.checkIn = 'Check-in cannot be in the past.';

    if (!checkOutValid) errors.checkOut = 'Please choose a check-out date.';
    else if (checkInValid && nights < 1) errors.checkOut = 'Check-out must be after check-in.';
    else if (nights > MAX_NIGHTS) {
      errors.checkOut = `Online bookings are limited to ${MAX_NIGHTS} nights. Please contact us for longer stays.`;
    }

    if (!Number.isInteger(data.guests) || data.guests < 1) {
      errors.guests = 'Please enter the number of guests.';
    } else if (room && data.guests > room.maxGuests) {
      errors.guests = `${room.name} sleeps up to ${room.maxGuests} guests.`;
    }

    if (data.notes.length > MAX_NOTES) errors.notes = `Notes must be ${MAX_NOTES} characters or fewer.`;

    if (Object.keys(errors).length > 0) throw new ValidationError(errors);

    return new Booking({
      reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      room: Object.freeze({ id: room.id, name: room.name }),
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      nights,
      guests: data.guests,
      notes: data.notes,
      pricePerNight: room.pricePerNight,
      totalPrice: calculateTotal(room, nights),
    });
  }
}
