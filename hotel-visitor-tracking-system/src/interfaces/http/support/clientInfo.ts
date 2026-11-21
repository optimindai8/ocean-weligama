import type { Request } from 'express';

export function getClientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? '';
}

export function getUserAgent(req: Request): string {
  return req.get('user-agent') ?? '';
}

/**
 * Country comes from a header set by the CDN in front of the app (e.g. Cloudflare's cf-ipcountry).
 * Only the single configured header is read, so no other header can influence the numbers.
 */
export function getCountryHint(req: Request, headerName: string | null): string | null {
  return headerName ? (req.get(headerName) ?? null) : null;
}
