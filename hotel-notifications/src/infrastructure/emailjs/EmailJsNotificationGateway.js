import { NotificationDeliveryError } from '../../application/errors.js';
import { getEmailJsConfig } from '../../config/emailjs.config.js';
import { toBookingTemplateParams, toContactTemplateParams } from './templateParams.js';

const EMAILJS_API_ENDPOINT = 'https://api.emailjs.com/api/v1.0/email/send';
const DEFAULT_REQUEST_TIMEOUT_MS = 10_000;

/**
 * Sends notifications through EmailJS.
 *
 * Designed with high resilience and security:
 * - Uses native `fetch` by default (0 CDN or external npm dependencies needed).
 * - Falls back to `globalThis.emailjs` if loaded.
 * - Enforces timeout protection and sanitizes error responses.
 */
export class EmailJsNotificationGateway {
  #sdk;
  #config;
  #format;
  #hotelName;

  constructor({ sdk = globalThis.emailjs, config, formatter, hotelName } = {}) {
    this.#sdk = sdk;
    this.#config = config || getEmailJsConfig();
    this.#format = formatter;
    this.#hotelName = hotelName;

    if (this.#sdk && typeof this.#sdk.init === 'function' && this.#config.publicKey) {
      try {
        this.#sdk.init({ publicKey: this.#config.publicKey });
      } catch (err) {
        console.warn('[EmailJsNotificationGateway] SDK init warning:', err);
      }
    }
  }

  sendContactNotification(message, sentAt) {
    return this.#send('contact', toContactTemplateParams(message, sentAt, this.#format, this.#hotelName));
  }

  sendBookingNotification(booking, sentAt) {
    return this.#send('booking', toBookingTemplateParams(booking, sentAt, this.#format, this.#hotelName));
  }

  async #send(templateKey, params) {
    const config = this.#config || getEmailJsConfig();
    const templateId = config.templates?.[templateKey];

    if (!config.publicKey || !config.serviceId || !templateId) {
      throw new NotificationDeliveryError(
        `EmailJS is not fully configured for "${templateKey}". Check your environment variables.`
      );
    }

    // 1. If global/passed SDK is available, try it first
    if (this.#sdk && typeof this.#sdk.send === 'function') {
      try {
        return await this.#sdk.send(config.serviceId, templateId, params);
      } catch (cause) {
        const status = cause?.status ?? 'error';
        const detail = cause?.text ?? cause?.message ?? 'unknown SDK error';
        throw new NotificationDeliveryError(`EmailJS SDK failed (${status}): ${detail}`, { cause });
      }
    }

    // 2. Otherwise use native fetch directly to EmailJS REST API
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller
      ? setTimeout(() => controller.abort(), DEFAULT_REQUEST_TIMEOUT_MS)
      : null;

    try {
      const response = await fetch(EMAILJS_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/plain, */*',
        },
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: templateId,
          user_id: config.publicKey,
          template_params: params,
        }),
        signal: controller?.signal,
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new NotificationDeliveryError(
          `EmailJS HTTP error ${response.status}: ${errorText || response.statusText}`
        );
      }

      return { status: response.status, text: 'OK' };
    } catch (cause) {
      if (cause instanceof NotificationDeliveryError) throw cause;

      const isAbort = cause?.name === 'AbortError';
      const message = isAbort
        ? 'EmailJS request timed out.'
        : `EmailJS network failure: ${cause?.message || 'unknown'}`;

      throw new NotificationDeliveryError(message, { cause });
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }
}
