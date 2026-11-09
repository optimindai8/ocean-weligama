/**
 * Hotel-specific settings for Ocean Air Weligama.
 */
export const HOTEL = Object.freeze({
  name: 'Ocean Air Weligama',
  email: 'pelanawhitehouse@gmail.com',
  phone: '+94 76 579 1763',
  address: 'No 42 Jayasayurupura Pelana, Weligama, Sri Lanka 81700',
  timeZone: 'Asia/Colombo',
  locale: 'en-GB',
  currency: 'EUR',
});

/**
 * Default room catalogue fallback used for testing and standalone calculations.
 */
export const ROOMS = Object.freeze([
  Object.freeze({ id: 'standard', name: 'Standard Room', pricePerNight: 12000, maxGuests: 2 }),
  Object.freeze({ id: 'deluxe', name: 'Deluxe Room', pricePerNight: 18000, maxGuests: 3 }),
  Object.freeze({ id: 'family-suite', name: 'Family Suite', pricePerNight: 28000, maxGuests: 5 }),
]);
