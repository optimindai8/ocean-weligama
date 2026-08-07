import type { Request, Response, NextFunction } from "express";

/**
 * Recursively sanitize strings in request body/query to prevent XSS & Injection.
 */
export function sanitizeValue(val: unknown): unknown {
  if (typeof val === "string") {
    // Strip dangerous HTML/script tags and JS handlers
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+\s*=/gi, "on_disabled=")
      .replace(/javascript:/gi, "disabled_javascript:");
  }

  if (val instanceof Date) {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }

  if (val !== null && typeof val === "object") {
    const obj = val as Record<string, unknown>;
    const sanitizedObj: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      // Prevent prototype pollution
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        continue;
      }
      sanitizedObj[key] = sanitizeValue(obj[key]);
    }
    return sanitizedObj;
  }

  return val;
}

/**
 * Express middleware to sanitize incoming body, query, and params in Express 5 safely.
 */
export function inputSanitizerMiddleware(req: Request, _res: Response, next: NextFunction): void {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === "object") {
    for (const key of Object.keys(req.query)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        delete (req.query as any)[key];
        continue;
      }
      (req.query as any)[key] = sanitizeValue(req.query[key]);
    }
  }
  if (req.params && typeof req.params === "object") {
    for (const key of Object.keys(req.params)) {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        delete (req.params as any)[key];
        continue;
      }
      (req.params as any)[key] = sanitizeValue(req.params[key]);
    }
  }
  next();
}

/**
 * Express middleware to sanitize outgoing JSON responses and strip sensitive properties like `passwordHash`.
 */
export function outputSanitizerMiddleware(_req: Request, res: Response, next: NextFunction): void {
  const originalJson = res.json.bind(res);

  res.json = (data: any) => {
    const cleanData = stripSensitiveFields(data);
    return originalJson(cleanData);
  };

  next();
}

function stripSensitiveFields(val: any): any {
  if (val === null || val === undefined) return val;

  if (val instanceof Date) {
    return val;
  }

  if (Array.isArray(val)) {
    return val.map(stripSensitiveFields);
  }

  if (typeof val === "object") {
    const cleanObj: Record<string, any> = {};
    for (const key of Object.keys(val)) {
      if (key === "passwordHash" || key === "password_hash") {
        continue; // Never expose password hash in any response
      }
      cleanObj[key] = stripSensitiveFields(val[key]);
    }
    return cleanObj;
  }

  return val;
}

