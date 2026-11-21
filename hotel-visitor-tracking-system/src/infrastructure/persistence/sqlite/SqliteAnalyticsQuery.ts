import type Database from 'better-sqlite3';
import type {
  AnalyticsQuery,
  BreakdownDimension,
  BreakdownRow,
  CustomEventRow,
  DailyRow,
  SummaryRow,
  TimeRange,
} from '../../../application/ports/AnalyticsQuery.js';

/**
 * Column expression for each breakdown. This is a fixed whitelist: user input is never
 * concatenated into SQL, all values are passed as bound parameters.
 */
const DIMENSION_SQL: Record<BreakdownDimension, string> = {
  page: 'path',
  medium: 'medium',
  source: 'source',
  country: "COALESCE(country, 'Unknown')",
  deviceType: 'device_type',
  browser: 'browser',
  os: 'os',
};

export class SqliteAnalyticsQuery implements AnalyticsQuery {
  private readonly summaryStmt: Database.Statement;
  private readonly engagementStmt: Database.Statement;
  private readonly dailyStmt: Database.Statement;
  private readonly eventsStmt: Database.Statement;
  private readonly activeStmt: Database.Statement;
  private readonly breakdownStmts = new Map<BreakdownDimension, Database.Statement>();

  constructor(db: Database.Database) {
    this.summaryStmt = db.prepare(`
      -- A visitor is "new" if their very first visit happened inside this period
      -- (they have at least one session that began without an existing cookie).
      -- Everyone else is "returning": they had already visited before the period started.
      SELECT COUNT(*)                                                     AS pageViews,
             COUNT(DISTINCT visitor_id)                                   AS visitors,
             COUNT(DISTINCT session_id)                                   AS sessions,
             COUNT(DISTINCT visitor_id)
               - COUNT(DISTINCT CASE WHEN is_returning = 0 THEN visitor_id END) AS returningVisitors
        FROM tracking_events
       WHERE type = 'pageview' AND occurred_at >= @from AND occurred_at < @to
    `);

    this.engagementStmt = db.prepare(`
      SELECT COALESCE(SUM(duration_ms), 0) AS engagedMs,
             COUNT(DISTINCT session_id)    AS engagedSessions
        FROM tracking_events
       WHERE type = 'engagement' AND occurred_at >= @from AND occurred_at < @to
    `);

    this.dailyStmt = db.prepare(`
      SELECT date(occurred_at / 1000 + @offsetSeconds, 'unixepoch') AS date,
             COUNT(DISTINCT visitor_id)                             AS visitors,
             COUNT(*)                                               AS pageViews
        FROM tracking_events
       WHERE type = 'pageview' AND occurred_at >= @from AND occurred_at < @to
       GROUP BY date
       ORDER BY date
    `);

    this.eventsStmt = db.prepare(`
      SELECT name, COUNT(*) AS count, COUNT(DISTINCT visitor_id) AS visitors
        FROM tracking_events
       WHERE type = 'custom' AND occurred_at >= @from AND occurred_at < @to
       GROUP BY name
       ORDER BY count DESC, name ASC
       LIMIT @limit
    `);

    this.activeStmt = db.prepare(`
      SELECT COUNT(DISTINCT visitor_id) AS active FROM tracking_events WHERE occurred_at >= ?
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
}

function bounds(range: TimeRange): { from: number; to: number } {
  return { from: range.from.getTime(), to: range.to.getTime() };
}
