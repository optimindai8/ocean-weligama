import type { SqliteDatabase, SqliteStatement } from './openDatabase.js';
import type {
  AnalyticsQuery,
  BreakdownDimension,
  BreakdownRow,
  CustomEventRow,
  DailyRow,
  SummaryRow,
  TimeRange,
  VisitorSessionRow,
} from '../../../application/ports/AnalyticsQuery.js';
import { resolvePageTitle } from '../../../domain/services/PageTitleResolver.js';

/**
 * Column expression for each breakdown. This is a fixed whitelist: user input is never
 * concatenated into SQL, all values are passed as bound parameters.
 */
const DIMENSION_SQL: Record<BreakdownDimension, string> = {
  page: 'path',
  medium: 'medium',
  source: 'source',
  country: "COALESCE(country, 'LK')",
  deviceType: 'device_type',
  browser: 'browser',
  os: 'os',
};

export class SqliteAnalyticsQuery implements AnalyticsQuery {
  private readonly db: SqliteDatabase;
  private readonly summaryStmt: SqliteStatement;
  private readonly engagementStmt: SqliteStatement;
  private readonly dailyStmt: SqliteStatement;
  private readonly eventsStmt: SqliteStatement;
  private readonly activeStmt: SqliteStatement;
  private readonly breakdownStmts = new Map<BreakdownDimension, SqliteStatement>();

  constructor(db: SqliteDatabase) {
    this.db = db;
    this.summaryStmt = db.prepare(`
      SELECT COUNT(*)                                                     AS pageViews,
             COUNT(DISTINCT visitor_id)                                   AS visitors,
             COUNT(DISTINCT session_id)                                   AS sessions,
             COUNT(DISTINCT visitor_id)
               - COUNT(DISTINCT CASE WHEN is_returning = 0 THEN visitor_id END) AS returningVisitors
        FROM tracking_events
       WHERE type = 'pageview' AND occurred_at >= @from AND occurred_at < @to
         AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
    `);

    this.engagementStmt = db.prepare(`
      SELECT COALESCE(SUM(duration_ms), 0) AS engagedMs,
             COUNT(DISTINCT session_id)    AS engagedSessions
        FROM tracking_events
       WHERE type = 'engagement' AND occurred_at >= @from AND occurred_at < @to
         AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
    `);

    this.dailyStmt = db.prepare(`
      SELECT date(occurred_at / 1000 + @offsetSeconds, 'unixepoch') AS date,
             COUNT(DISTINCT visitor_id)                             AS visitors,
             COUNT(*)                                               AS pageViews
        FROM tracking_events
       WHERE type = 'pageview' AND occurred_at >= @from AND occurred_at < @to
         AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
       GROUP BY date
       ORDER BY date
    `);

    this.eventsStmt = db.prepare(`
      SELECT name, COUNT(*) AS count, COUNT(DISTINCT visitor_id) AS visitors
        FROM tracking_events
       WHERE type = 'custom' AND occurred_at >= @from AND occurred_at < @to
         AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
       GROUP BY name
       ORDER BY count DESC, name ASC
       LIMIT @limit
    `);

    this.activeStmt = db.prepare(`
      SELECT COUNT(DISTINCT visitor_id) AS active FROM tracking_events 
       WHERE occurred_at >= ?
         AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
    `);

    for (const [dimension, expression] of Object.entries(DIMENSION_SQL) as Array<[BreakdownDimension, string]>) {
      this.breakdownStmts.set(
        dimension,
        db.prepare(`
          SELECT ${expression}                AS label,
                 COUNT(DISTINCT visitor_id)   AS visitors,
                 COUNT(*)                     AS views
            FROM tracking_events
           WHERE type = 'pageview' AND occurred_at >= @from AND occurred_at < @to
             AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
           GROUP BY label
           ORDER BY visitors DESC, views DESC, label ASC
           LIMIT @limit
        `),
      );
    }
  }

  async summary(range: TimeRange): Promise<SummaryRow> {
    const params = bounds(range);
    const visits = this.summaryStmt.get(params) as Pick<
      SummaryRow,
      'pageViews' | 'visitors' | 'sessions' | 'returningVisitors'
    >;
    const engagement = this.engagementStmt.get(params) as Pick<SummaryRow, 'engagedMs' | 'engagedSessions'>;
    return { ...visits, ...engagement };
  }

  async daily(range: TimeRange, utcOffsetMinutes: number): Promise<DailyRow[]> {
    return this.dailyStmt.all({ ...bounds(range), offsetSeconds: utcOffsetMinutes * 60 }) as DailyRow[];
  }

  async breakdown(dimension: BreakdownDimension, range: TimeRange, limit: number): Promise<BreakdownRow[]> {
    if (dimension === "page") {
      const stmt = this.db.prepare(`
        SELECT ${DIMENSION_SQL.page} AS label,
               COUNT(DISTINCT visitor_id) AS visitors,
               COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS views,
               COALESCE(MAX(occurred_at), 0) AS maxOccurredAt,
               COALESCE(SUM(CASE WHEN type = 'engagement' THEN duration_ms ELSE 0 END), 0) AS totalEngagedMs,
               COUNT(DISTINCT CASE WHEN type = 'engagement' AND duration_ms > 0 THEN session_id END) AS engagedSessions
          FROM tracking_events
         WHERE occurred_at >= @from AND occurred_at < @to
           AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
         GROUP BY label
        HAVING COUNT(CASE WHEN type = 'pageview' THEN 1 END) > 0
         ORDER BY visitors DESC, views DESC, label ASC
         LIMIT @limit
      `);

      const rows = stmt.all({ ...bounds(range), limit }) as Array<{
        label: string;
        visitors: number;
        views: number;
        maxOccurredAt: number;
        totalEngagedMs: number;
        engagedSessions: number;
      }>;

      const recentStmt = this.db.prepare(`
        SELECT COALESCE(NULLIF(path, ''), '/') AS label,
               occurred_at AS occurredAt,
               country,
               device_type AS deviceType,
               browser
          FROM tracking_events
         WHERE type = 'pageview'
           AND occurred_at >= @from AND occurred_at < @to
           AND path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
         ORDER BY occurred_at DESC
         LIMIT 60
      `);

      const recentRows = recentStmt.all(bounds(range)) as Array<{
        label: string;
        occurredAt: number;
        country: string | null;
        deviceType: string | null;
        browser: string | null;
      }>;

      const recentMap = new Map<string, Array<{ occurredAt: number; time: string; country?: string; deviceType?: string; browser?: string }>>();
      for (const r of recentRows) {
        const list = recentMap.get(r.label) || [];
        if (list.length < 5) {
          list.push({
            occurredAt: r.occurredAt,
            time: new Date(r.occurredAt).toISOString(),
            country: r.country || "LK",
            deviceType: r.deviceType || "desktop",
            browser: r.browser || "Browser",
          });
          recentMap.set(r.label, list);
        }
      }

      return rows.map((row) => {
        const views = row.views || 0;
        const engagedSessions = row.engagedSessions || 0;
        const totalEngagedMs = row.totalEngagedMs || 0;
        const divisor = engagedSessions > 0 ? engagedSessions : views;
        const avgDurationSeconds = divisor > 0 ? Math.round(totalEngagedMs / divisor / 1000) : 0;
        const maxOccurredAt = row.maxOccurredAt || 0;
        const lastVisitedAt = maxOccurredAt > 0 ? new Date(maxOccurredAt).toISOString() : null;

        const path = row.label || "/";
        const { title, category } = resolvePageTitle(path);

        return {
          label: path,
          title,
          category,
          visitors: row.visitors || 0,
          views,
          avgDurationSeconds,
          lastVisitedAt,
          recentVisits: recentMap.get(row.label) || [],
        };
      });
    }

    const statement = this.breakdownStmts.get(dimension);
    if (!statement) throw new Error(`Unsupported breakdown dimension: ${dimension}`);
    return statement.all({ ...bounds(range), limit }) as BreakdownRow[];
  }

  async customEvents(range: TimeRange, limit: number): Promise<CustomEventRow[]> {
    return this.eventsStmt.all({ ...bounds(range), limit }) as CustomEventRow[];
  }

  async activeVisitorsSince(since: Date): Promise<number> {
    const row = this.activeStmt.get(since.getTime()) as { active: number };
    return row.active;
  }

  async visitors(range: TimeRange, limit: number): Promise<VisitorSessionRow[]> {
    const stmt = this.db.prepare(`
      WITH session_agg AS (
        SELECT 
          session_id AS sessionId,
          visitor_id AS visitorId,
          MIN(occurred_at) AS firstSeenAt,
          MAX(occurred_at) AS lastSeenAt,
          COALESCE(SUM(CASE WHEN type = 'engagement' THEN duration_ms ELSE 0 END), 0) AS durationMs,
          COUNT(CASE WHEN type = 'pageview' THEN 1 END) AS pageViews,
          COALESCE(country, 'LK') AS country,
          COALESCE(browser, 'Other') AS browser,
          COALESCE(os, 'Other') AS os,
          COALESCE(device_type, 'desktop') AS deviceType,
          COALESCE(ip_hash, '') AS ip,
          COALESCE(path, '/') AS landingPage
        FROM tracking_events
        WHERE path NOT LIKE '/ow-admin%' AND path NOT LIKE '/admin%' AND path NOT LIKE '%/admin%'
        GROUP BY session_id, visitor_id
      ),
      numbered_sessions AS (
        SELECT 
          ROW_NUMBER() OVER (ORDER BY firstSeenAt ASC) AS visitorNumber,
          *
        FROM session_agg
      )
      SELECT * 
      FROM numbered_sessions
      WHERE firstSeenAt >= @from AND firstSeenAt < @to
      ORDER BY visitorNumber DESC
      LIMIT @limit
    `);
    const rows = stmt.all({ ...bounds(range), limit }) as any[];
    return rows.map((r, i) => ({
      id: Number(r.visitorNumber || i + 1),
      sessionId: r.sessionId,
      visitorId: r.visitorId,
      ip: r.ip || "",
      country: r.country || "LK",
      firstSeenAt: Number(r.firstSeenAt),
      lastSeenAt: Number(r.lastSeenAt),
      durationMs: Number(r.durationMs || 0),
      pageViews: Number(r.pageViews || 0),
      browser: r.browser || "Other",
      os: r.os || "Other",
      deviceType: r.deviceType || "desktop",
      landingPage: r.landingPage || "/",
    }));
  }
}

function bounds(range: TimeRange): { from: number; to: number } {
  return { from: range.from.getTime(), to: range.to.getTime() };
}
