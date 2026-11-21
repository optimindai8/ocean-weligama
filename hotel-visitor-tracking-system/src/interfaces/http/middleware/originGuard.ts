import type { RequestHandler } from 'express';

/**
 * Only the hotel's own website(s) may send tracking data.
 * Browsers always attach an Origin header to cross-site POST requests, and scripts
 * running on other websites cannot change it. This stops other sites from stuffing the stats.
 */
export function originGuard(allowedOrigins: readonly string[]): RequestHandler {
  const allowed = new Set(allowedOrigins);

  return (req, res, next) => {
    const origin = req.get('origin');

    if (!origin || !allowed.has(origin)) {
      res.status(403).json({ error: 'origin_not_allowed' });
      return;
    }

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // Helmet's default ("same-origin") makes browsers log a blocked-resource error on the
    // hotel website for every tracking request. The origin check above is the real gatekeeper.
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      res.setHeader('Access-Control-Max-Age', '86400');
      res.status(204).end();
      return;
    }

    next();
  };
}
