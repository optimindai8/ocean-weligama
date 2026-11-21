// Codes that CDNs use for "unknown" / "Tor" / "reserved"; they are not real countries.
const NOT_A_COUNTRY = new Set(['XX', 'T1', 'ZZ', 'A1', 'A2', 'O1']);

/** Returns an upper-case ISO 3166-1 alpha-2 code, or null when the value is missing or not a real country. */
export function parseCountryCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const code = raw.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || NOT_A_COUNTRY.has(code)) return null;
  return code;
}
