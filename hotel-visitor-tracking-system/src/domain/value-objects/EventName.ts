import { ValidationError } from '../errors/DomainError.js';

const EVENT_NAME = /^[a-z][a-z0-9_]{1,39}$/;

/** Name of a custom action, e.g. "booking_click". snake_case, 2-40 characters. */
export class EventName {
  private constructor(readonly value: string) {}

  static from(raw: unknown): EventName {
    if (typeof raw !== 'string' || !EVENT_NAME.test(raw)) {
      throw new ValidationError('event name must be snake_case, 2-40 characters');
    }
    return new EventName(raw);
  }
}
