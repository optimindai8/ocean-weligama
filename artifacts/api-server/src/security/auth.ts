import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || "ocean-weligama-super-secure-jwt-secret-2025!";

export interface AdminPayload {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export function signToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h", algorithm: "HS256" });
}

export function verifyToken(token: string): AdminPayload {
  return jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] }) as AdminPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Express middleware to mandate valid admin credentials on a specific route.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing or invalid authentication token" });
    return;
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "Unauthorized: Empty token provided" });
    return;
  }

  try {
    const payload = verifyToken(token);
    if (!payload || (payload.role !== "admin" && payload.role !== "super_admin")) {
      res.status(403).json({ error: "Forbidden: Admin privilege required" });
      return;
    }
    (req as Request & { admin: AdminPayload }).admin = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Token is invalid or expired" });
  }
}

/**
 * Fail-safe global middleware that intercepts all incoming requests to admin endpoints.
 * If any request hits an admin path (e.g. /v1/admin/*) except public login, it enforces admin authorization.
 */
export function globalAdminGuard(req: Request, res: Response, next: NextFunction): void {
  const path = req.path || req.originalUrl || "";
  
  // Public admin endpoints allowed without token
  const isPublicAdminRoute = path.includes("/admin/auth/login");

  const isAdminRoute = path.includes("/admin/") || path.includes("/v1/admin");

  if (isAdminRoute && !isPublicAdminRoute) {
    requireAdmin(req, res, next);
    return;
  }

  next();
}
