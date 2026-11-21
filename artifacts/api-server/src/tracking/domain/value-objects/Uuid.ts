import { ValidationError } from '../errors/DomainError.js';

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseUuidV4(raw: unknown, field: string): string {
  if (typeof raw !== 'string' || !UUID_V4.test(raw)) {
    throw new ValidationError(`${field} must be a UUID v4`);
  }
  return raw.toLowerCase();
}
