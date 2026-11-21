import express, { Router, type RequestHandler } from 'express';
import type { VerifyAdminSession } from '../../../application/use-cases/VerifyAdminSession.js';
import type { AdminController } from '../controllers/AdminController.js';
import { createLoginLimiter } from '../middleware/rateLimiters.js';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { requireXhrHeader } from '../middleware/requireXhrHeader.js';

interface Options {
  controller: AdminController;
  verifyAdminSession: VerifyAdminSession;
}

const noStore: RequestHandler = (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
};

/** Private JSON API used by the admin dashboard (same origin only, cookie authenticated). */
export function createAdminRouter({ controller, verifyAdminSession }: Options): Router {
  const router = Router();
  const adminOnly = requireAdmin(verifyAdminSession);

  router.use(noStore);
  router.use(express.json({ limit: '4kb' }));

  router.post('/login', createLoginLimiter(), requireXhrHeader, controller.login);
  router.post('/logout', requireXhrHeader, controller.logout);

  router.get('/session', adminOnly, controller.session);
  router.get('/analytics', adminOnly, controller.analytics);

  return router;
}
