export interface SessionClaims {
  username: string;
}

export interface SessionTokenService {
  issue(username: string, now: Date): string;
  /** Returns the claims for a genuine, unexpired token; null for anything else. */
  verify(token: string, now: Date): SessionClaims | null;
}
