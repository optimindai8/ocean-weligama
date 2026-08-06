import type { Request, Response, NextFunction } from "express";

/**
 * Express middleware to inject modern, defense-in-depth HTTP security headers.
 */
export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction): void {
  // Prevent clickjacking attacks by forbidding iframe framing
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME-type sniffing attacks
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable legacy XSS filter protection in supported browsers
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Restrict referrer information passed in HTTP headers
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Enforce HTTPS HSTS (HTTP Strict Transport Security)
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // Restrict browser features (camera, microphone, geolocation)
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), payment=(), usb=()"
  );

  // Content Security Policy (CSP) for API server
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none'; object-src 'none';"
  );

  // Prevent server technology disclosure
  res.removeHeader("X-Powered-By");

  next();
}
