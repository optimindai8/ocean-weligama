export function parseCookies(header: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = Object.create(null) as Record<string, string>;
  if (!header) return cookies;

  for (const part of header.split(';')) {
    const index = part.indexOf('=');
    if (index < 1) continue;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (!(name in cookies)) {
      try {
        cookies[name] = decodeURIComponent(value);
      } catch {
        // ignore malformed cookie values
      }
    }
  }
  return cookies;
}

export interface CookieOptions {
  maxAgeSeconds: number;
  path: string;
  secure: boolean;
}

/** Always HttpOnly (JavaScript cannot read it) and SameSite=Strict (never sent on cross-site requests). */
export function serializeSessionCookie(name: string, value: string, options: CookieOptions): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${options.maxAgeSeconds}`,
    `Path=${options.path}`,
    'HttpOnly',
    'SameSite=Strict',
  ];
  if (options.secure) parts.push('Secure');
  return parts.join('; ');
}
