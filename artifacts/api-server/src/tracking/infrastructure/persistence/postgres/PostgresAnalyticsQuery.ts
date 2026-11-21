import type {
  AnalyticsQuery,
  BreakdownDimension,
  BreakdownRow,
  CustomEventRow,
  DailyRow,
  SummaryRow,
  TimeRange,
  VisitorSessionRow,
} from "../../../application/ports/AnalyticsQuery.js";
import type { PgQueryExecutor } from "./PostgresEventRepository.js";
import { resolvePageTitle } from "../../../domain/services/PageTitleResolver.js";

const DIMENSION_SQL: Record<BreakdownDimension, string> = {
  page: "COALESCE(NULLIF(path, ''), '/')",
  medium: "COALESCE(NULLIF(medium, ''), 'none')",
  source: "COALESCE(NULLIF(source, ''), 'direct')",
  country: "COALESCE(NULLIF(country, ''), 'LK')",
  deviceType: "COALESCE(NULLIF(device_type, ''), 'desktop')",
  browser: "COALESCE(NULLIF(browser, ''), 'Other')",
  os: "COALESCE(NULLIF(os, ''), 'Other')",
};

export class PostgresAnalyticsQuery implements AnalyticsQuery {
  constructor(private readonly pool: PgQueryExecutor) {}

  async summary(range: TimeRange): Promise<SummaryRow> {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();

    const visitsRes = await this.pool.query<{
      pageViews: number | string;
      visitors: number | string;
      sessions: number | string;
      returningVisitors: number | string;
    }>(
      `
      SELECT 
        COUNT(CASE WHEN type = 'pageview' THEN 1 END)::int AS "pageViews",
        COUNT(DISTINCT visitor_id)::int AS "visitors",
        COUNT(DISTINCT session_id)::int AS "sessions",
        (COUNT(DISTINCT visitor_id) - COUNT(DISTINCT CASE WHEN is_returning = 0 THEN visitor_id END))::int AS "returningVisitors"
      FROM tracking_events
      WHERE occurred_at >= $1 AND occurred_at < $2
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      `,
      [fromMs, toMs]
    );

    const engRes = await this.pool.query<{
      engagedMs: number | string;
      engagedSessions: number | string;
    }>(
      `
      SELECT 
        COALESCE(SUM(duration_ms), 0)::bigint AS "engagedMs",
        COUNT(DISTINCT session_id)::int AS "engagedSessions"
      FROM tracking_events
      WHERE type = 'engagement' AND occurred_at >= $1 AND occurred_at < $2
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      `,
      [fromMs, toMs]
    );

    const visits = visitsRes.rows[0] || {
      pageViews: 0,
      visitors: 0,
      sessions: 0,
      returningVisitors: 0,
    };

    const eng = engRes.rows[0] || {
      engagedMs: 0,
      engagedSessions: 0,
    };

    return {
      pageViews: Number(visits.pageViews || 0),
      visitors: Number(visits.visitors || 0),
      sessions: Number(visits.sessions || 0),
      returningVisitors: Number(visits.returningVisitors || 0),
      engagedMs: Number(eng.engagedMs || 0),
      engagedSessions: Number(eng.engagedSessions || 0),
    };
  }

  async daily(range: TimeRange, utcOffsetMinutes: number): Promise<DailyRow[]> {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();
    const isHourly = (toMs - fromMs) <= 86400000;
    const formatStr = isHourly ? 'HH24:00' : 'YYYY-MM-DD';

    const res = await this.pool.query<{
      date: string;
      visitors: number | string;
      pageViews: number | string;
    }>(
      `
      SELECT 
        TO_CHAR((TO_TIMESTAMP(occurred_at / 1000.0) AT TIME ZONE 'UTC') + ($3 || ' minutes')::interval, '${formatStr}') AS date,
        COUNT(DISTINCT visitor_id)::int AS "visitors",
        COUNT(CASE WHEN type = 'pageview' THEN 1 END)::int AS "pageViews"
      FROM tracking_events
      WHERE occurred_at >= $1 AND occurred_at < $2
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      GROUP BY date
      ORDER BY date ASC
      `,
      [fromMs, toMs, utcOffsetMinutes]
    );

    return res.rows.map((row: { date: string; visitors: number | string; pageViews: number | string }) => ({
      date: row.date,
      visitors: Number(row.visitors || 0),
      pageViews: Number(row.pageViews || 0),
    }));
  }

  async breakdown(dimension: BreakdownDimension, range: TimeRange, limit: number): Promise<BreakdownRow[]> {
    const expression = DIMENSION_SQL[dimension];
    if (!expression) throw new Error(`Unsupported breakdown dimension: ${dimension}`);

    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();

    if (dimension === "page") {
      const roomMap = new Map<string, string>();
      const serviceMap = new Map<string, string>();
      const serviceCategoryMap = new Map<string, string>();
      const blogMap = new Map<string, string>();
      try {
        const [roomRes, serviceRes, blogRes] = await Promise.all([
          this.pool.query<{ id: string; slug: string; name: string }>(
            `SELECT r.id::text AS id, r.slug, COALESCE(NULLIF(t.name, ''), r.slug) AS name 
             FROM rooms r 
             LEFT JOIN room_translations t ON r.id = t.room_id AND (t.locale = 'en' OR t.locale IS NULL)
             WHERE r.deleted_at IS NULL`
          ),
          this.pool.query<{ id: string; slug: string; category: string; type: string; name: string }>(
            `SELECT s.id::text AS id, s.slug, s.category, s.type, COALESCE(NULLIF(t.name, ''), s.slug) AS name 
             FROM services s 
             LEFT JOIN service_translations t ON s.id = t.service_id AND (t.locale = 'en' OR t.locale IS NULL)`
          ),
          this.pool.query<{ id: string; title: string }>(
            `SELECT id::text AS id, title 
             FROM blogs 
             WHERE deleted_at IS NULL`
          ),
        ]);
        for (const r of roomRes.rows) {
          const cleanName = (r.name || "").trim();
          if (r.slug) roomMap.set(r.slug.toLowerCase().trim(), cleanName);
          if (r.id) roomMap.set(r.id.toLowerCase().trim(), cleanName);
        }
        for (const s of serviceRes.rows) {
          const cleanName = (s.name || "").trim();
          const cat = (s.category || s.type || "").trim();
          if (s.slug) {
            serviceMap.set(s.slug.toLowerCase().trim(), cleanName);
            serviceCategoryMap.set(s.slug.toLowerCase().trim(), cat);
          }
          if (s.id) {
            serviceMap.set(s.id.toLowerCase().trim(), cleanName);
            serviceCategoryMap.set(s.id.toLowerCase().trim(), cat);
          }
        }
        for (const b of blogRes.rows) {
          const cleanTitle = (b.title || "").trim();
          if (b.id) blogMap.set(b.id.toLowerCase().trim(), cleanTitle);
          const titleSlug = cleanTitle.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
          if (titleSlug) {
            blogMap.set(titleSlug, cleanTitle);
          }
        }
      } catch {
        // Fallback to static resolution
      }

      const res = await this.pool.query<{
        label: string;
        visitors: number | string;
        views: number | string;
        maxOccurredAt: number | string;
        totalEngagedMs: number | string;
        engagedSessions: number | string;
      }>(
        `
        SELECT 
          ${expression} AS label,
          COUNT(DISTINCT visitor_id)::int AS "visitors",
          COUNT(CASE WHEN type = 'pageview' THEN 1 END)::int AS "views",
          COALESCE(MAX(occurred_at), 0)::bigint AS "maxOccurredAt",
          COALESCE(SUM(CASE WHEN type = 'engagement' THEN duration_ms ELSE 0 END), 0)::bigint AS "totalEngagedMs",
          COUNT(DISTINCT CASE WHEN type = 'engagement' AND duration_ms > 0 THEN session_id END)::int AS "engagedSessions"
        FROM tracking_events
        WHERE occurred_at >= $1 AND occurred_at < $2
          AND path NOT LIKE '/ow-admin%' 
          AND path NOT LIKE '/admin%' 
          AND path NOT LIKE '%/admin%'
        GROUP BY label
        HAVING COUNT(CASE WHEN type = 'pageview' THEN 1 END) > 0
        ORDER BY "visitors" DESC, "views" DESC, label ASC
        LIMIT $3
        `,
        [fromMs, toMs, limit]
      );

      const labels = res.rows.map((r) => r.label);
      const recentMap = new Map<string, Array<{ occurredAt: number; time: string; country?: string; deviceType?: string; browser?: string }>>();

      if (labels.length > 0) {
        try {
          const recentRes = await this.pool.query<{
            label: string;
            occurredAt: number | string;
            country: string | null;
            deviceType: string | null;
            browser: string | null;
          }>(
            `
            SELECT 
              COALESCE(NULLIF(path, ''), '/') AS label,
              occurred_at AS "occurredAt",
              country,
              device_type AS "deviceType",
              browser
            FROM tracking_events
            WHERE type = 'pageview'
              AND occurred_at >= $1 AND occurred_at < $2
              AND COALESCE(NULLIF(path, ''), '/') = ANY($3)
              AND path NOT LIKE '/ow-admin%' 
              AND path NOT LIKE '/admin%' 
              AND path NOT LIKE '%/admin%'
            ORDER BY occurred_at DESC
            LIMIT 50
            `,
            [fromMs, toMs, labels]
          );

          for (const r of recentRes.rows) {
            const list = recentMap.get(r.label) || [];
            if (list.length < 5) {
              const occMs = Number(r.occurredAt);
              list.push({
                occurredAt: occMs,
                time: new Date(occMs).toISOString(),
                country: r.country || "LK",
                deviceType: r.deviceType || "desktop",
                browser: r.browser || "Browser",
              });
              recentMap.set(r.label, list);
            }
          }
        } catch {
          // Fallback if recent query encounters any issue
        }
      }

      return res.rows.map((row) => {
        const views = Number(row.views || 0);
        const engagedSessions = Number(row.engagedSessions || 0);
        const totalEngagedMs = Number(row.totalEngagedMs || 0);
        const divisor = engagedSessions > 0 ? engagedSessions : views;
        const avgDurationSeconds = divisor > 0 ? Math.round(totalEngagedMs / divisor / 1000) : 0;
        const maxOccurredAt = Number(row.maxOccurredAt || 0);
        const lastVisitedAt = maxOccurredAt > 0 ? new Date(maxOccurredAt).toISOString() : null;

        const path = row.label || "/";
        const { title, category } = resolvePageTitle(path, roomMap, serviceMap, blogMap, serviceCategoryMap);

        return {
          label: path,
          title,
          category,
          visitors: Number(row.visitors || 0),
          views,
          avgDurationSeconds,
          lastVisitedAt,
          recentVisits: recentMap.get(row.label) || [],
        };
      });
    }

    const res = await this.pool.query<{
      label: string;
      visitors: number | string;
      views: number | string;
    }>(
      `
      SELECT 
        ${expression} AS label,
        COUNT(DISTINCT visitor_id)::int AS "visitors",
        COUNT(CASE WHEN type = 'pageview' THEN 1 END)::int AS "views"
      FROM tracking_events
      WHERE occurred_at >= $1 AND occurred_at < $2
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      GROUP BY label
      ORDER BY "visitors" DESC, "views" DESC, label ASC
      LIMIT $3
      `,
      [fromMs, toMs, limit]
    );

    return res.rows.map((row: { label: string; visitors: number | string; views: number | string }) => ({
      label: row.label || "LK",
      visitors: Number(row.visitors || 0),
      views: Number(row.views || 0),
    }));
  }

  async customEvents(range: TimeRange, limit: number): Promise<CustomEventRow[]> {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();

    const res = await this.pool.query<{
      name: string;
      count: number | string;
      visitors: number | string;
    }>(
      `
      SELECT 
        name, 
        COUNT(*)::int AS "count", 
        COUNT(DISTINCT visitor_id)::int AS "visitors"
      FROM tracking_events
      WHERE type = 'custom' AND name IS NOT NULL AND occurred_at >= $1 AND occurred_at < $2
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      GROUP BY name
      ORDER BY "count" DESC, name ASC
      LIMIT $3
      `,
      [fromMs, toMs, limit]
    );

    return res.rows.map((row: { name: string; count: number | string; visitors: number | string }) => ({
      name: row.name || "Unknown",
      count: Number(row.count || 0),
      visitors: Number(row.visitors || 0),
    }));
  }

  async activeVisitorsSince(since: Date): Promise<number> {
    const res = await this.pool.query<{ active: number | string }>(
      `
      SELECT COUNT(DISTINCT visitor_id)::int AS active 
      FROM tracking_events 
      WHERE occurred_at >= $1
        AND path NOT LIKE '/ow-admin%' 
        AND path NOT LIKE '/admin%' 
        AND path NOT LIKE '%/admin%'
      `,
      [since.getTime()]
    );

    return Number(res.rows[0]?.active || 0);
  }

  async visitors(range: TimeRange, limit: number): Promise<VisitorSessionRow[]> {
    const fromMs = range.from.getTime();
    const toMs = range.to.getTime();

    const res = await this.pool.query<{
      visitorNumber: number | string;
      sessionId: string;
      visitorId: string;
      firstSeenAt: number | string;
      lastSeenAt: number | string;
      durationMs: number | string;
      pageViews: number | string;
      country: string | null;
      browser: string | null;
      os: string | null;
      deviceType: string | null;
      ip: string | null;
      landingPage: string | null;
    }>(
      `
      WITH session_agg AS (
        SELECT 
          session_id AS "sessionId",
          visitor_id AS "visitorId",
          MIN(occurred_at)::bigint AS "firstSeenAt",
          MAX(occurred_at)::bigint AS "lastSeenAt",
          COALESCE(SUM(CASE WHEN type = 'engagement' THEN duration_ms ELSE 0 END), 0)::bigint AS "durationMs",
          COUNT(CASE WHEN type = 'pageview' THEN 1 END)::int AS "pageViews",
          COALESCE(NULLIF(MAX(country), ''), 'LK') AS country,
          COALESCE(NULLIF(MAX(browser), ''), 'Other') AS browser,
          COALESCE(NULLIF(MAX(os), ''), 'Other') AS os,
          COALESCE(NULLIF(MAX(device_type), ''), 'desktop') AS "deviceType",
          COALESCE(NULLIF(MAX(ip), ''), NULLIF(MAX(ip_hash), ''), '') AS ip,
          COALESCE(NULLIF(MIN(CASE WHEN type = 'pageview' THEN path END), ''), '/') AS "landingPage"
        FROM tracking_events
        WHERE path NOT LIKE '/ow-admin%' 
          AND path NOT LIKE '/admin%' 
          AND path NOT LIKE '%/admin%'
        GROUP BY session_id, visitor_id
      ),
      numbered_sessions AS (
        SELECT 
          ROW_NUMBER() OVER (ORDER BY "firstSeenAt" ASC)::int AS "visitorNumber",
          *
        FROM session_agg
      )
      SELECT * 
      FROM numbered_sessions
      WHERE "firstSeenAt" >= $1 AND "firstSeenAt" < $2
      ORDER BY "visitorNumber" DESC
      LIMIT $3
      `,
      [fromMs, toMs, limit]
    );

    return res.rows.map((row) => {
      const firstSeenAt = Number(row.firstSeenAt);
      const lastSeenAt = Number(row.lastSeenAt);
      let durationMs = Number(row.durationMs || 0);
      if (durationMs === 0 && lastSeenAt > firstSeenAt) {
        durationMs = lastSeenAt - firstSeenAt;
      }

      return {
        id: Number(row.visitorNumber),
        sessionId: row.sessionId,
        visitorId: row.visitorId,
        ip: row.ip || "",
        country: row.country || "LK",
        firstSeenAt,
        lastSeenAt,
        durationMs,
        pageViews: Number(row.pageViews || 0),
        browser: row.browser || "Other",
        os: row.os || "Other",
        deviceType: row.deviceType || "desktop",
        landingPage: row.landingPage || "/",
      };
    });
  }
}
