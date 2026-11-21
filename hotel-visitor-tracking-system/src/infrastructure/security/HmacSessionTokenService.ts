import { createHmac, timingSafeEqual } from 'node:crypto';
import type { SessionClaims, SessionTokenService } from '../../application/ports/SessionTokenService.js';

/**
 * Stateless signed session token: base64url(payload).base64url(HMAC-SHA256(payload)).
 * The payload holds only the username and the expiry time. Any change breaks the signature.
 */
export class HmacSessionTokenService implements SessionTokenService {
  constructor(
    private readonly secret: string,
    private readonly ttlSeconds: number,
  ) {}

  issue(username: string, now: Date): string {
    const payload = Buffer.from(
      JSON.stringify({ sub: username, exp: Math.floor(now.getTime() / 1000) + this.ttlSeconds }),
    ).toString('base64url');
    return `${payload}.${this.sign(payload)}`;
  }

  verify(token: string, now: Date): SessionClaims | null {
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const [payload, signature] = parts as [string, string];

    const expected = Buffer.from(this.sign(payload));
    const actual = Buffer.from(signature);
    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

    try {
      const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { sub?: unknown; exp?: unknown };
      if (typeof claims.sub !== 'string' || typeof claims.exp !== 'number') return null;
      if (claims.exp <= Math.floor(now.getTime() / 1000)) return null;
      return { username: claims.sub };
    } catch {
      return null;
    }
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('base64url');
  }
}
