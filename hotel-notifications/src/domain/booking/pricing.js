import { parseIsoDate } from '../shared/dates.js';

const MS_PER_DAY = 86_400_000;

/** Whole nights between two "YYYY-MM-DD" dates (0 when either date is invalid). */
export function countNights(checkIn, checkOut) {
  const start = parseIsoDate(checkIn);
  const end = parseIsoDate(checkOut);
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / MS_PER_DAY));
}

/** Full price of the stay. Extend here if you add taxes, service charge or discounts. */
export function calculateTotal(room, nights) {
  return room.pricePerNight * nights;
}
