import { resolveRange, type ReportPeriod } from '../../domain/value-objects/ReportPeriod.js';
import type { DashboardAnalyticsDto } from '../dto/DashboardAnalyticsDto.js';
import type { AnalyticsQuery } from '../ports/AnalyticsQuery.js';
import type { Clock } from '../ports/Clock.js';

const ONLINE_WINDOW_MS = 5 * 60 * 1000;
const TOP_N = 10;

interface Dependencies {
  query: AnalyticsQuery;
  clock: Clock;
  utcOffsetMinutes: number;
}

const round2 = (value: number): number => Math.round(value * 100) / 100;

/** Builds everything the admin dashboard shows for one time period. */
export class GetDashboardAnalytics {
  constructor(private readonly deps: Dependencies) {}

  async execute(period: ReportPeriod): Promise<DashboardAnalyticsDto> {
    const { query, clock, utcOffsetMinutes } = this.deps;

    const now = clock.now();
    const resolved = resolveRange(period, now, utcOffsetMinutes);
    const range = { from: resolved.from, to: resolved.to };

    const [summary, dailyRows, topPages, mediums, sources, countries, devices, browsers, operatingSystems, events, onlineNow] =
      await Promise.all([
        query.summary(range),
        query.daily(range, utcOffsetMinutes),
        query.breakdown('page', range, TOP_N),
        query.breakdown('medium', range, TOP_N),
        query.breakdown('source', range, TOP_N),
        query.breakdown('country', range, TOP_N),
        query.breakdown('deviceType', range, TOP_N),
        query.breakdown('browser', range, TOP_N),
        query.breakdown('os', range, TOP_N),
        query.customEvents(range, 20),
        query.activeVisitorsSince(new Date(now.getTime() - ONLINE_WINDOW_MS)),
      ]);

    // Days with no traffic are missing from the database result; fill them with zeros for a continuous chart.
    const byDay = new Map(dailyRows.map((row) => [row.date, row]));
    const daily = resolved.localDays.map((date) => ({
      date,
      visitors: byDay.get(date)?.visitors ?? 0,
      pageViews: byDay.get(date)?.pageViews ?? 0,
    }));

    return {
      generatedAt: now.toISOString(),
      period,
      range: { from: resolved.from.toISOString(), to: resolved.to.toISOString() },
      utcOffsetMinutes,
      onlineNow,
      summary: {
        visitors: summary.visitors,
        newVisitors: Math.max(0, summary.visitors - summary.returningVisitors),
        returningVisitors: summary.returningVisitors,
        pageViews: summary.pageViews,
        sessions: summary.sessions,
        pagesPerSession: summary.sessions > 0 ? round2(summary.pageViews / summary.sessions) : 0,
        avgEngagedSeconds:
          summary.engagedSessions > 0 ? Math.round(summary.engagedMs / summary.engagedSessions / 1000) : 0,
      },
      daily,
      topPages,
      mediums,
      sources,
      countries,
      devices,
      browsers,
      operatingSystems,
      events,
    };
  }
}
