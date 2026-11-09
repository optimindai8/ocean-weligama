const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[0-9\s\-()]{7,20}$/;

/** Single-line text: collapses whitespace and trims. */
export const clean = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();

/** Multi-line text: keeps line breaks, normalises them and trims. */
export const cleanMultiline = (value) => String(value ?? '').replace(/\r\n?/g, '\n').trim();

export const isEmail = (value) => EMAIL_PATTERN.test(value);

export function isPhone(value) {
  if (!PHONE_PATTERN.test(value)) return false;
  const digits = value.replace(/\D/g, '').length;
  return digits >= 7 && digits <= 15;
}
