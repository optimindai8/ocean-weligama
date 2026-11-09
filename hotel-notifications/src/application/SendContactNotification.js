import { ContactMessage } from '../domain/contact/ContactMessage.js';

/** Use case: validate a contact form submission and notify the hotel by email. */
export class SendContactNotification {
  #gateway;
  #clock;

  /** @param {{ notificationGateway: import('./ports/NotificationGateway.js').NotificationGateway, clock?: () => Date }} deps */
  constructor({ notificationGateway, clock = () => new Date() }) {
    this.#gateway = notificationGateway;
    this.#clock = clock;
  }

  /** @throws {import('../domain/shared/errors.js').ValidationError} when the input is invalid */
  async execute(input) {
    const message = ContactMessage.create(input);
    await this.#gateway.sendContactNotification(message, this.#clock());
  }
}
