import type { Request, Response, NextFunction } from "express";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Express middleware to validate file uploads against malicious content, oversized payloads, and path traversal.
 */
export function fileSecurityGuard(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;

  if (!file) {
    next();
    return;
  }

  // 1. Check size limit
  if (file.size > MAX_FILE_SIZE) {
    res.status(400).json({ error: "File upload rejected: Exceeds maximum size limit (5MB)." });
    return;
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    res.status(400).json({
      error: `File upload rejected: Invalid file type '${file.mimetype}'. Only images (JPEG, PNG, WEBP, GIF) are allowed.`,
    });
    return;
  }

  // 3. Validate file extension & check path traversal
  const rawOriginalName = file.originalname || "";
  if (rawOriginalName.includes("..") || rawOriginalName.includes("/") || rawOriginalName.includes("\\")) {
    res.status(400).json({ error: "File upload rejected: Path traversal characters detected in filename." });
    return;
  }

  const fileExt = rawOriginalName.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED_EXTENSIONS.has(fileExt)) {
    res.status(400).json({ error: `File upload rejected: Invalid extension '.${fileExt}'.` });
    return;
  }

  next();
}
