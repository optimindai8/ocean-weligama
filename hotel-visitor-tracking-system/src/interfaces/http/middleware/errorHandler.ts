import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { Logger } from '../../../application/ports/Logger.js';
import { AuthenticationError, ValidationError } from '../../../domain/errors/DomainError.js';

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({ error: 'not_found' });
};

function httpStatusOf(error: unknown): number | null {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    const status = (error as { status: unknown }).status;
    if (typeof status === 'number' && status >= 400 && status < 600) return status;
  }
  return null;
}

/** Turns errors into safe JSON responses. Internal details are logged, never sent to the client. */
export function createErrorHandler(logger: Logger): ErrorRequestHandler {
  return (error: unknown, req, res, next) => {
    if (res.headersSent) {
      next(error);
      return;
    }

    if (error instanceof ValidationError) {
      res.status(400).json({ error: 'invalid_request', message: error.message });
      return;
    }
    if (error instanceof AuthenticationError) {
      res.status(401).json({ error: 'unauthorized' });
      return;
    }

    // Errors raised by the body parser: payload too large (413), malformed JSON (400), ...
    const status = httpStatusOf(error);
    if (status !== null && status < 500) {
      res.status(status).json({ error: status === 413 ? 'payload_too_large' : 'bad_request' });
      return;
    }

    logger.error('unhandled_error', {
      method: req.method,
      path: req.path,
      message: error instanceof Error ? error.message : 'unknown error',
    });
    res.status(500).json({ error: 'internal_error' });
  };
}
