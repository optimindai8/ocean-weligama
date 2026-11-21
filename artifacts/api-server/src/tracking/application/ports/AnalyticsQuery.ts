/** Read side of storage (reporting). Kept separate from the write side on purpose. */

/** `from` is inclusive, `to` is exclusive. */
export interface TimeRange {
  from: Date;
  to: Date;
}

export interface SummaryRow {
  pageViews: number;
  visitors: number;
  sessions: number;
  returningVisitors: number;
  /** Total visible time of all engagement events, in milliseconds. */
  engagedMs: number;
  /** Number of distinct sessions that reported engagement time. */
  engagedSessions: number;
}

export interface DailyRow {
  /** Local calendar day, YYYY-MM-DD. */
  date: string;
  visitors: number;
  pageViews: number;
}

export type BreakdownDimension = 'page' | 'medium' | 'source' | 'country' | 'deviceType' | 'browser' | 'os';

export interface RecentVisitDto {
  occurredAt: number;
  time: string;
  country?: string;
  deviceType?: string;
  browser?: string;
}

export interface BreakdownRow {
  label: string;
  title?: string;
  category?: string;
  visitors: number;
  views: number;
  avgDurationSeconds?: number;
  lastVisitedAt?: string | null;
  recentVisits?: RecentVisitDto[];
}

export interface CustomEventRow {
  name: string;
  count: number;
  visitors: number;
}

export interface VisitorSessionRow {
  id: number;
  sessionId: string;
  visitorId: string;
  ip: string;
  country: string;
  firstSeenAt: number;
  lastSeenAt: number;
  durationMs: number;
  pageViews: number;
  browser: string;
  os: string;
  deviceType: string;
  landingPage?: string;
}

export interface AnalyticsQuery {
  summary(range: TimeRange): Promise<SummaryRow>;
  daily(range: TimeRange, utcOffsetMinutes: number): Promise<DailyRow[]>;
  breakdown(dimension: BreakdownDimension, range: TimeRange, limit: number): Promise<BreakdownRow[]>;
  customEvents(range: TimeRange, limit: number): Promise<CustomEventRow[]>;
  /** Detailed visitor session entries */
  visitors(range: TimeRange, limit: number): Promise<VisitorSessionRow[]>;
  /** Distinct visitors with any activity at or after `since`. */
  activeVisitorsSince(since: Date): Promise<number>;
}
