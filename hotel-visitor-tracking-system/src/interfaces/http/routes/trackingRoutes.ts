import express, { Router } from 'express';
import type { TrackingController } from '../controllers/TrackingController.js';
import { originGuard } from '../middleware/originGuard.js';
import { createCollectLimiter } from '../middleware/rateLimiters.js';

interface Options {
  controller: TrackingController;
  allowedOrigins: readonly string[];
  collectRateLimitPerMinute: number;
}

/** Public endpoint used by the tracker script on the hotel website. */
export function createTrackingRouter({ controller, allowedOrigins, collectRateLimitPerMinute }: Options): Router {
  const router = Router();

  router.use('/collect', originGuard(allowedOrigins));
  router.post(
    '/collect',
    createCollectLimiter(collectRateLimitPerMinute),
    // Tiny body limit: a tracking message is ~300 bytes.
    express.text({ type: () => true, limit: '2kb' }),
    controller.collect,
  );

  return router;
}
