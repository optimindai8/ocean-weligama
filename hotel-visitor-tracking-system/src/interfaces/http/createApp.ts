import path from 'node:path';
import express, { type Express } from 'express';
import helmet from 'helmet';
import type { Logger } from '../../application/ports/Logger.js';
import type { AuthenticateAdmin } from '../../application/use-cases/AuthenticateAdmin.js';
import type { GetDashboardAnalytics } from '../../application/use-cases/GetDashboardAnalytics.js';
import type { RecordTrackingEvent } from '../../application/use-cases/RecordTrackingEvent.js';
import type { VerifyAdminSession } from '../../application/use-cases/VerifyAdminSession.js';
import type { AppConfig } from '../../infrastructure/config/env.js';
import { AdminController } from './controllers/AdminController.js';
import { TrackingController } from './controllers/TrackingController.js';
import { createErrorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { createAdminRouter } from './routes/adminRoutes.js';
import { createTrackingRouter } from './routes/trackingRoutes.js';

export interface HttpDependencies {
  config: AppConfig;
  logger: Logger;
  /** Folder that contains tracker/ and admin/ static files. */
  publicDir: string;
  useCases: {
    recordTrackingEvent: RecordTrackingEvent;
    getDashboardAnalytics: GetDashboardAnalytics;
    authenticateAdmin: AuthenticateAdmin;
    verifyAdminSession: VerifyAdminSession;
  };
}

export function createApp({ config, logger, publicDir, useCases }: HttpDependencies): Express {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);

  app.use(
    helmet({
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Plain-http local development would break if every asset were force-upgraded to https.
          'upgrade-insecure-requests': config.isProduction ? [] : null,
        },
      },
    }),
  );

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // --- Public: tracking endpoint + tracker script -----------------------------------------
  app.use(
    '/api/v1',
    createTrackingRouter({
      controller: new TrackingController(useCases.recordTrackingEvent, config.countryHeader),
      allowedOrigins: config.allowedOrigins,
      collectRateLimitPerMinute: config.collectRateLimitPerMinute,
    }),
  );

  app.get('/hotel-tracker.js', (_req, res, next) => {
    // The script is loaded by the hotel website (another origin), so it must be cross-origin readable.
    // Cached for a day: returning guests do not download it again.
    res.sendFile(
      path.join(publicDir, 'tracker', 'hotel-tracker.js'),
      { maxAge: '1d', headers: { 'Cross-Origin-Resource-Policy': 'cross-origin' } },
      (error) => (error ? next(error) : undefined),
    );
  });

  // --- Private: admin API + dashboard pages ------------------------------------------------
  app.use(
    '/admin/api',
    createAdminRouter({
      controller: new AdminController(useCases.authenticateAdmin, useCases.getDashboardAnalytics, {
        secure: config.isProduction,
        sessionTtlSeconds: config.sessionTtlSeconds,
      }),
      verifyAdminSession: useCases.verifyAdminSession,
    }),
  );
  app.use('/admin', express.static(path.join(publicDir, 'admin'), { index: 'index.html', maxAge: '1h' }));

  app.use(notFoundHandler);
  app.use(createErrorHandler(logger));

  return app;
}
