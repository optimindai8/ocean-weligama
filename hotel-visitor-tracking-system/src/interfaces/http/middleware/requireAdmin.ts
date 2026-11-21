import type { RequestHandler } from 'express';
import type { VerifyAdminSession } from '../../../application/use-cases/VerifyAdminSession.js';
import { parseCookies } from '../support/cookies.js';

export const SESSION_COOKIE = 'hva_session';

/** Lets the request through only when it carries a valid admin session cookie. */
export function requireAdmin(verifyAdminSession: VerifyAdminSession): RequestHandler {
  return (req, res, next) => {
    const token = parseCookies(req.get('cookie'))[SESSION_COOKIE];
    // Throws AuthenticationError -> the error handler answers 401.
    res.locals.admin = verifyAdminSession.execute(token);
    next();
  };
}
