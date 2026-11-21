import { AuthenticationError } from '../../domain/errors/DomainError.js';
import type { AdminCredentialsVerifier } from '../ports/AdminCredentialsVerifier.js';
import type { Clock } from '../ports/Clock.js';
import type { SessionTokenService } from '../ports/SessionTokenService.js';

interface Dependencies {
  credentials: AdminCredentialsVerifier;
  tokens: SessionTokenService;
  clock: Clock;
}

/** Checks the admin's username and password and, if correct, issues a session token. */
export class AuthenticateAdmin {
  constructor(private readonly deps: Dependencies) {}

  async execute(command: { username: string; password: string }): Promise<{ token: string; username: string }> {
    const { credentials, tokens, clock } = this.deps;

    const ok = await credentials.verify(command.username, command.password);
    // One generic message: never reveal whether the username or the password was wrong.
    if (!ok) throw new AuthenticationError('Invalid credentials');

    return { token: tokens.issue(command.username, clock.now()), username: command.username };
  }
}
