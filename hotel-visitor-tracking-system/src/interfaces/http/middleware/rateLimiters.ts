import { rateLimit } from 'express-rate-limit';

/** Generous limit: many guests share one IP on hotel Wi-Fi. Only stops floods. */
export function createCollectLimiter(perMinute: number) {
  return rateLimit({
    windowMs: 60_000,
    limit: perMinute,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'rate_limited' },
  });
}

/** Strict limit on password attempts. Successful logins do not count. */
export function createLoginLimiter() {
  return rateLimit({
    windowMs: 15 * 60_000,
    limit: 10,
    skipSuccessfulRequests: true,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'too_many_attempts' },
  });
}
