import type { ReportPeriod } from '../../domain/value-objects/ReportPeriod.js';

export interface RecentVisitDto {
  occurredAt: number;
  time: string;
  country?: string;
  deviceType?: string;
  browser?: string;
}

export interface BreakdownItemDto {
  label: string;
  title?: string;
  category?: string;
  visitors: number;
  views: number;
  avgDurationSeconds?: number;
  lastVisitedAt?: string | null;
  recentVisits?: RecentVisitDto[];
}

export interface VisitorSessionDto {
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

export interface DashboardAnalyticsDto {
  generatedAt: string;
  period: ReportPeriod;
  range: { from: string; to: string };
  utcOffsetMinutes: number;
  /** Visitors active in the last 5 minutes. */
  onlineNow: number;
  summary: {
    visitors: number;
    newVisitors: number;
    returningVisitors: number;
    pageViews: number;
    sessions: number;
    pagesPerSession: number;
    /** Average visible time per session, in seconds. */
    avgEngagedSeconds: number;
  };
  daily: Array<{ date: string; visitors: number; pageViews: number }>;
  topPages: BreakdownItemDto[];
  mediums: BreakdownItemDto[];
  sources: BreakdownItemDto[];
  countries: BreakdownItemDto[];
  devices: BreakdownItemDto[];
  browsers: BreakdownItemDto[];
  operatingSystems: BreakdownItemDto[];
  events: Array<{ name: string; count: number; visitors: number }>;
  visitorsList: VisitorSessionDto[];
}
