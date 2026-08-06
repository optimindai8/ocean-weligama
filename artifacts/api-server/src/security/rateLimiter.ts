import type { Request, Response, NextFunction } from "express";

interface RateLimitRecord {
  timestamps: number[];
  burstTimestamps: number[];
}

const store = new Map<string, RateLimitRecord>();

// Periodic memory cleanup every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of store.entries()) {
    record.timestamps = record.timestamps.filter((t) => now - t < 900000); // 15 mins
    record.burstTimestamps = record.burstTimestamps.filter((t) => now - t < 5000); // 5 secs
    if (record.timestamps.length === 0 && record.burstTimestamps.length === 0) {
      store.delete(key);
    }
  }
}, 600000);

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded)) {
    return forwarded[0].trim();
  }
  return req.socket?.remoteAddress || "127.0.0.1";
}

/**
 * Creates an Express rate-limiting middleware.
 * @param windowMs Time window in milliseconds (default: 60,000ms = 1 minute)
 * @param maxRequests Maximum allowed requests per window (default: 100)
 * @param burstMax Maximum allowed rapid requests in a short 2-second burst window to prevent for-loop scraping (default: 15)
 */
export function createRateLimiter(opts?: {
  windowMs?: number;
  maxRequests?: number;
  burstMax?: number;
  message?: string;
}) {
  const windowMs = opts?.windowMs ?? 60000;
  const maxRequests = opts?.maxRequests ?? 100;
  const burstMax = opts?.burstMax ?? 15;
  const burstWindowMs = 2000; // 2 seconds
  const message = opts?.message ?? "Too many requests. Please slow down and try again.";

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = getClientIp(req);
    const routeKey = `${ip}:${req.path}`;
    const now = Date.now();

    let record = store.get(routeKey);
    if (!record) {
      record = { timestamps: [], burstTimestamps: [] };
      store.set(routeKey, record);
    }

    // Filter old timestamps
    record.timestamps = record.timestamps.filter((t) => now - t < windowMs);
    record.burstTimestamps = record.burstTimestamps.filter((t) => now - t < burstWindowMs);

    // 1. Anti-Scraping / Burst Protection: Check if client is executing a rapid for-loop script
    if (record.burstTimestamps.length >= burstMax) {
      res.setHeader("Retry-After", Math.ceil(burstWindowMs / 1000).toString());
      res.status(429).json({
        error: "Rate limit exceeded: Rapid burst requests detected (anti-scraping system activated).",
        retryAfterSeconds: Math.ceil(burstWindowMs / 1000),
      });
      return;
    }

    // 2. Window Rate Limit: Check if client exceeded window limit
    if (record.timestamps.length >= maxRequests) {
      res.setHeader("Retry-After", Math.ceil(windowMs / 1000).toString());
      res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      });
      return;
    }

    record.timestamps.push(now);
    record.burstTimestamps.push(now);
    next();
  };
}

/**
 * Global rate limiter for public API endpoints (100 req/min, burst max 15 / 2s).
 */
export const publicApiRateLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 100,
  burstMax: 15,
  message: "Too many API requests. Anti-scraping guard triggered.",
});

/**
 * Strict rate limiter for sensitive authentication endpoints (10 req/15min).
 */
export const authEndpointRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
  burstMax: 3,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});
