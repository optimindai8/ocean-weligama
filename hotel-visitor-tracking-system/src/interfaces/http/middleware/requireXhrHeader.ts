import type { RequestHandler } from 'express';

/**
 * CSRF defence for state-changing admin requests, on top of the SameSite=Strict cookie.
 * A plain HTML form on another site cannot add a custom header, only our own dashboard can.
 */
export const requireXhrHeader: RequestHandler = (req, res, next) => {
  if (req.get('x-requested-with') !== 'hotel-admin') {
    res.status(403).json({ error: 'forbidden' });
    return;
  }
  next();
};
