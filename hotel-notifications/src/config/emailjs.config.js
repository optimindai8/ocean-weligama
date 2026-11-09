/**
 * EmailJS configuration loaded dynamically from environment variables (.env).
 *
 * Supports both Vite frontend (import.meta.env) and Node.js/Test environments (process.env).
 * Keeps API credentials out of source code for security.
 */

function readEnv(key, viteKey) {
  // Vite client-side environment
  if (typeof import.meta !== 'undefined' && import.meta?.env) {
    if (import.meta.env[viteKey]) return import.meta.env[viteKey];
    if (import.meta.env[key]) return import.meta.env[key];
  }
  // Node.js / CLI environment
  if (typeof process !== 'undefined' && process?.env) {
    if (process.env[viteKey]) return process.env[viteKey];
    if (process.env[key]) return process.env[key];
  }
  return '';
}

export function getEmailJsConfig() {
  const publicKey = readEnv('EMAILJS_PUBLIC_KEY', 'VITE_EMAILJS_PUBLIC_KEY');
  const serviceId = readEnv('EMAILJS_SERVICE_ID', 'VITE_EMAILJS_SERVICE_ID');
  const contactTemplate = readEnv('EMAILJS_CONTACT_TEMPLATE_ID', 'VITE_EMAILJS_CONTACT_TEMPLATE_ID');
  const bookingTemplate = readEnv('EMAILJS_BOOKING_TEMPLATE_ID', 'VITE_EMAILJS_BOOKING_TEMPLATE_ID');

  return Object.freeze({
    publicKey,
    serviceId,
    templates: Object.freeze({
      contact: contactTemplate,
      booking: bookingTemplate,
    }),
    isConfigured: Boolean(publicKey && serviceId && contactTemplate && bookingTemplate),
  });
}

export const EMAILJS_CONFIG = getEmailJsConfig();
