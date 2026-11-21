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

export interface BreakdownRow {
  label: string;
  visitors: number;
  views: number;
}

export interface CustomEventRow {
  name: string;
  count: number;
  visitors: number;
}

export interface AnalyticsQuery {
  summary(range: TimeRange): Promise<SummaryRow>;
  daily(range: TimeRange, utcOffsetMinutes: number): Promise<DailyRow[]>;
  breakdown(dimension: BreakdownDimension, range: TimeRange, limit: number): Promise<BreakdownRow[]>;
  customEvents(range: TimeRange, limit: number): Promise<CustomEventRow[]>;
  /** Distinct visitors with any activity at or after `since`. */
  activeVisitorsSince(since: Date): Promise<number>;
}
