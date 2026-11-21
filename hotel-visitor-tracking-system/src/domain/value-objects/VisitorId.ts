import { parseUuidV4 } from './Uuid.js';

/** Random, anonymous identifier stored in the guest's first-party cookie. */
export class VisitorId {
  private constructor(readonly value: string) {}

  static from(raw: unknown): VisitorId {
    return new VisitorId(parseUuidV4(raw, 'visitorId'));
  }
}
