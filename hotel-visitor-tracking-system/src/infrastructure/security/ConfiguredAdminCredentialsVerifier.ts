import { createHash, timingSafeEqual } from 'node:crypto';
import type { AdminCredentialsVerifier } from '../../application/ports/AdminCredentialsVerifier.js';
import { verifyPassword } from './ScryptPassword.js';

const sha256 = (value: string): Buffer => createHash('sha256').update(value).digest();

/** Checks credentials against the single admin account defined in the environment. */
export class ConfiguredAdminCredentialsVerifier implements AdminCredentialsVerifier {
  constructor(
    private readonly adminUsername: string,
    private readonly adminPasswordHash: string,
  ) {}

  async verify(username: string, password: string): Promise<boolean> {
    // Both checks always run, so response time does not reveal which one failed.
    const usernameMatches = timingSafeEqual(sha256(username), sha256(this.adminUsername));
    const passwordMatches = await verifyPassword(password, this.adminPasswordHash);
    return usernameMatches && passwordMatches;
  }
}
