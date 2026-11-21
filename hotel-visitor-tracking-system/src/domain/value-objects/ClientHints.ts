/**
 * Optional details reported by the guest's browser. They are untrusted input,
 * so each one is validated and silently dropped (null) when it does not look right.
 */

export function sanitizeLanguage(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  return value.length <= 35 && /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8}){0,3}$/.test(value) ? value : null;
}

export function sanitizeTimezone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim();
  return value.length <= 64 && /^[A-Za-z][A-Za-z0-9_+-]*(\/[A-Za-z0-9_+-]+){0,2}$/.test(value) ? value : null;
}

export function sanitizeScreenWidth(raw: number | null | undefined): number | null {
  if (typeof raw !== 'number' || !Number.isInteger(raw)) return null;
  return raw >= 200 && raw <= 10_000 ? raw : null;
}
