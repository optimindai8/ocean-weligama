/**
 * Parses a strict "YYYY-MM-DD" string.
 * Returns the UTC-midnight timestamp, or NaN when the value is not a real date.
 */
export function parseIsoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value ?? '');
  if (!match) return NaN;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  const isRealDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  return isRealDate ? timestamp : NaN;
}

/** Today's date as "YYYY-MM-DD" in the given IANA time zone. */
export function todayInZone(now, timeZone) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}
