/**
 * Port: what the application needs from any email provider.
 * EmailJS implements it today (src/infrastructure/emailjs); another provider can
 * replace it later without touching the domain or the use cases.
 *
 * @typedef {Object} NotificationGateway
 * @property {(message: import('../../domain/contact/ContactMessage.js').ContactMessage, sentAt: Date) => Promise<void>} sendContactNotification
 * @property {(booking: import('../../domain/booking/Booking.js').Booking, sentAt: Date) => Promise<void>} sendBookingNotification
 */
export {};
