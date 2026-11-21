/**
 * Clean facade for hotel email notifications using EmailJS.
 * Connects the web application to the clean architecture hotel-notifications module.
 */
import {
  sendContactEmail as sendContactEmailCore,
  sendBookingEmail as sendBookingEmailCore,
  createSubmissionGuard as createSubmissionGuardCore,
  isHoneypotTripped as isHoneypotTrippedCore,
  isEmailJsConfigured,
  // @ts-expect-error Untyped JS composition module
} from "@hotel-notifications/composition.js";

export interface ContactNotificationPayload {
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface BookingNotificationPayload {
  reference: string;
  guestFullName: string;
  guestEmail: string;
  guestPhone: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestCount: number;
  totalPrice: string;
  pricePerNight?: string;
  specialRequests?: string;
}

/**
 * Sends a notification email to the hotel for a new contact form message.
 */
export async function sendContactNotification(payload: ContactNotificationPayload): Promise<void> {
  try {
    await sendContactEmailCore({
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || "Not provided",
      subject: payload.subject || "Website Inquiry",
      message: payload.message,
    });
  } catch (error) {
    // Log error safely without halting user flow
    console.warn("[Notifications] Failed to send contact email notification:", error);
  }
}

/**
 * Sends a notification email to the hotel for a newly created booking with exact details.
 */
export async function sendBookingNotification(payload: BookingNotificationPayload): Promise<void> {
  try {
    await sendBookingEmailCore({
      reference: payload.reference,
      guestFullName: payload.guestFullName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone || "Not provided",
      roomName: payload.roomName,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights: payload.nights,
      guestCount: payload.guestCount,
      totalPrice: payload.totalPrice,
      pricePerNight: payload.pricePerNight,
      specialRequests: payload.specialRequests || "None",
    });
  } catch (error) {
    console.warn("[Notifications] Failed to send booking email notification:", error);
  }
}

export const submissionGuard = createSubmissionGuardCore({ key: "ocean_weligama:contact:cooldown", cooldownMs: 25_000 });
export const isHoneypotTripped = isHoneypotTrippedCore;
export { isEmailJsConfigured };

