import type { ReportPeriod } from '../../domain/value-objects/ReportPeriod.js';

export interface BreakdownItemDto {
  label: string;
  visitors: number;
  views: number;
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
}
