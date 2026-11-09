/**
 * Composition root: the single source of wiring between layers.
 * Follows Clean Architecture: presentation components import from this module.
 */
import { getEmailJsConfig } from './config/emailjs.config.js';
import { HOTEL, ROOMS } from './config/hotel.config.js';
import { GetBookingQuote } from './application/GetBookingQuote.js';
import { SendBookingNotification } from './application/SendBookingNotification.js';
import { SendContactNotification } from './application/SendContactNotification.js';
import { generateBookingReference } from './infrastructure/browser/bookingReference.js';
import { createSubmissionGuard, isHoneypotTripped } from './infrastructure/browser/submissionGuard.js';
import { EmailJsNotificationGateway } from './infrastructure/emailjs/EmailJsNotificationGateway.js';
import { createFormatters } from './infrastructure/emailjs/formatters.js';

const formatter = createFormatters(HOTEL);

function createGateway() {
  return new EmailJsNotificationGateway({
    config: getEmailJsConfig(),
    formatter,
    hotelName: HOTEL.name,
  });
}

const notificationGateway = createGateway();

const sendContactUseCase = new SendContactNotification({ notificationGateway });
const sendBookingUseCase = new SendBookingNotification({
  notificationGateway,
  rooms: ROOMS,
  timeZone: HOTEL.timeZone,
  referenceGenerator: generateBookingReference,
});
const getBookingQuoteUseCase = new GetBookingQuote({ rooms: ROOMS });

/** Backwards-compatible dependency container. */
export const container = Object.freeze({
  rooms: ROOMS,
  formatMoney: formatter.money,
  sendContactNotification: sendContactUseCase,
  sendBookingNotification: sendBookingUseCase,
  getBookingQuote: getBookingQuoteUseCase,
});

/**
 * Convenient, high-level helper to send a contact form notification to the hotel.
 *
 * @param {{ fullName?: string, name?: string, email: string, phone?: string, subject?: string, message: string }} payload
 */
export async function sendContactEmail(payload) {
  const name = payload.fullName || payload.name || '';
  return sendContactUseCase.execute({
    name,
    email: payload.email,
    phone: payload.phone || '',
    subject: payload.subject || 'Website Inquiry',
    message: payload.message,
  });
}

/**
 * Convenient, high-level helper to send a booking notification to the hotel.
 *
 * @param {{
 *   reference?: string,
 *   guestFullName?: string,
 *   name?: string,
 *   guestEmail?: string,
 *   email: string,
 *   guestPhone?: string,
 *   phone?: string,
 *   roomName?: string,
 *   checkIn: string,
 *   checkOut: string,
 *   nights: number | string,
 *   guestCount?: number | string,
 *   guests?: number | string,
 *   totalPrice: string | number,
 *   pricePerNight?: string | number,
 *   notes?: string,
 *   specialRequests?: string
 * }} payload
 */
export async function sendBookingEmail(payload) {
  const sentAt = new Date();
  const gateway = createGateway();

  // Send directly through the gateway to handle website-specific multi-room / dynamic pricing structures
  return gateway.sendBookingNotification(payload, sentAt);
}

export function isEmailJsConfigured() {
  return getEmailJsConfig().isConfigured;
}

export {
  createSubmissionGuard,
  isHoneypotTripped,
  getEmailJsConfig,
  HOTEL,
  ROOMS,
};
