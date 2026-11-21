import type { Request, Response } from 'express';
import type { AuthenticateAdmin } from '../../../application/use-cases/AuthenticateAdmin.js';
import type { GetDashboardAnalytics } from '../../../application/use-cases/GetDashboardAnalytics.js';
import { ValidationError } from '../../../domain/errors/DomainError.js';
import { SESSION_COOKIE } from '../middleware/requireAdmin.js';
import { serializeSessionCookie } from '../support/cookies.js';
import { analyticsQuerySchema, loginSchema } from '../validation/adminSchemas.js';

interface CookieSettings {
  secure: boolean;
  sessionTtlSeconds: number;
}

const COOKIE_PATH = '/admin';

export class AdminController {
  constructor(
    private readonly authenticateAdmin: AuthenticateAdmin,
    private readonly getDashboardAnalytics: GetDashboardAnalytics,
    private readonly cookies: CookieSettings,
  ) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new ValidationError('username and password are required');

    const { token } = await this.authenticateAdmin.execute(parsed.data);
    res.setHeader(
      'Set-Cookie',
      serializeSessionCookie(SESSION_COOKIE, token, {
        maxAgeSeconds: this.cookies.sessionTtlSeconds,
        path: COOKIE_PATH,
        secure: this.cookies.secure,
      }),
    );
    res.json({ ok: true });
  };

  logout = (_req: Request, res: Response): void => {
    res.setHeader(
      'Set-Cookie',
      serializeSessionCookie(SESSION_COOKIE, '', { maxAgeSeconds: 0, path: COOKIE_PATH, secure: this.cookies.secure }),
    );
    res.json({ ok: true });
  };

  session = (_req: Request, res: Response): void => {
    res.json({ username: (res.locals.admin as { username: string }).username });
  };

  analytics = async (req: Request, res: Response): Promise<void> => {
    const parsed = analyticsQuerySchema.safeParse(req.query);
    if (!parsed.success) throw new ValidationError('period must be one of: today, 7d, 30d, 90d');

    res.json(await this.getDashboardAnalytics.execute(parsed.data.period));
  };
}
