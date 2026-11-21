import type { TrackingEvent } from "../../../domain/entities/TrackingEvent.js";
import type { EventRepository } from "../../../application/ports/EventRepository.js";

export interface PgQueryExecutor {
  query<R = any>(text: string, values?: any[]): Promise<{ rows: R[]; rowCount: number | null }>;
}

export class PostgresEventRepository implements EventRepository {
  constructor(private readonly pool: PgQueryExecutor) {}

  async save(event: TrackingEvent): Promise<void> {
    const p = event.props;
    const sql = `
      INSERT INTO tracking_events (
        type, name, occurred_at, visitor_id, session_id, path, is_returning, duration_ms,
        referrer_host, source, medium, campaign, device_type, browser, os,
        country, language, timezone, screen_width, ip_hash, ip
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21
      )
    `;

    await this.pool.query(sql, [
      p.type,
      p.name?.value ?? null,
      p.occurredAt.getTime(),
      p.visitorId.value,
      p.sessionId.value,
      p.path.value,
      p.isReturning ? 1 : 0,
      p.durationMs ?? null,
      p.traffic.referrerHost,
      p.traffic.source,
      p.traffic.medium,
      p.traffic.campaign ?? null,
      p.deviceType,
      p.browser,
      p.os,
      p.country ?? null,
      p.language ?? null,
      p.timezone ?? null,
      p.screenWidth ?? null,
      p.ipHash,
      p.ip ?? null,
    ]);
  }

  async deleteOlderThan(cutoff: Date): Promise<number> {
    const res = await this.pool.query("DELETE FROM tracking_events WHERE occurred_at < $1", [
      cutoff.getTime(),
    ]);
    return res.rowCount ?? 0;
  }

  async clearAll(): Promise<void> {
    await this.pool.query("TRUNCATE TABLE tracking_events RESTART IDENTITY;");
  }
}
