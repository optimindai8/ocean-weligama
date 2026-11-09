/** Thrown when the email provider could not accept or deliver a notification. */
export class NotificationDeliveryError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'NotificationDeliveryError';
  }
}
