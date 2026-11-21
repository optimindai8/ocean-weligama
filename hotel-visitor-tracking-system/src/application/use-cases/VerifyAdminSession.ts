import { AuthenticationError } from '../../domain/errors/DomainError.js';
import type { Clock } from '../ports/Clock.js';
import type { SessionTokenService } from '../ports/SessionTokenService.js';

interface Dependencies {
  tokens: SessionTokenService;
  clock: Clock;
}

/** Confirms that a session token is genuine and still valid. */
export class VerifyAdminSession {
  constructor(private readonly deps: Dependencies) {}

  execute(token: string | undefined): { username: string } {
    if (!token) throw new AuthenticationError('Missing session');
    const claims = this.deps.tokens.verify(token, this.deps.clock.now());
    if (!claims) throw new AuthenticationError('Invalid or expired session');
    return { username: claims.username };
  }
}
