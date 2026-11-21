import { createHmac } from 'node:crypto';
import type { IpHasher } from '../../application/ports/IpHasher.js';

/**
 * Keyed, one-way hash of the IP address. The date is part of the input, so the same
 * IP produces a different hash every day: it can spot abuse within a day but can never
 * be used to follow a person across days. The raw IP is never written to disk.
 */
export class HmacIpHasher implements IpHasher {
  constructor(private readonly secret: string) {}

  hash(ip: string, at: Date): string {
    const day = at.toISOString().slice(0, 10);
    return createHmac('sha256', this.secret).update(`${day}|${ip}`).digest('hex').slice(0, 32);
  }
}
