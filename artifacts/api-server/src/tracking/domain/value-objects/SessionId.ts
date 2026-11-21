import { parseUuidV4 } from './Uuid.js';

/** Identifier of one browsing session (one visit to the website). */
export class SessionId {
  private constructor(readonly value: string) {}

  static from(raw: unknown): SessionId {
    return new SessionId(parseUuidV4(raw, 'sessionId'));
  }
}
