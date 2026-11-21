export const REPORT_PERIODS = ['today', '7d', '30d', '90d'] as const;
export type ReportPeriod = (typeof REPORT_PERIODS)[number];

const PERIOD_DAYS: Record<ReportPeriod, number> = { today: 1, '7d': 7, '30d': 30, '90d': 90 };
const DAY_MS = 86_400_000;

export interface ResolvedRange {
  /** Inclusive start (UTC instant of local midnight). */
  from: Date;
  /** Exclusive end (UTC instant of the next local midnight). */
  to: Date;
  /** Local calendar days covered, as YYYY-MM-DD, oldest first. */
  localDays: string[];
}

export function isReportPeriod(value: unknown): value is ReportPeriod {
  return typeof value === 'string' && (REPORT_PERIODS as readonly string[]).includes(value);
}

/**
 * Turns "last 7 days" into exact UTC boundaries aligned to the hotel's local midnight,
 * so "today" and the daily chart match the calendar the hotel staff actually use.
 */
export function resolveRange(period: ReportPeriod, now: Date, utcOffsetMinutes: number): ResolvedRange {
  const days = PERIOD_DAYS[period];
  const offsetMs = utcOffsetMinutes * 60_000;

  const localMidnightToday = Math.floor((now.getTime() + offsetMs) / DAY_MS) * DAY_MS;
  const firstLocalMidnight = localMidnightToday - (days - 1) * DAY_MS;

  const localDays = period === 'today'
    ? Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0') + ':00')
    : Array.from({ length: days }, (_, i) =>
        new Date(firstLocalMidnight + i * DAY_MS).toISOString().slice(0, 10),
      );

  return {
    from: new Date(firstLocalMidnight - offsetMs),
    to: new Date(localMidnightToday + DAY_MS - offsetMs),
    localDays,
  };
}
