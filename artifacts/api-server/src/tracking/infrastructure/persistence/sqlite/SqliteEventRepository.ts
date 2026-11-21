import type { SqliteDatabase, SqliteStatement } from './openDatabase.js';
import type { TrackingEvent } from '../../../domain/entities/TrackingEvent.js';
import type { EventRepository } from '../../../application/ports/EventRepository.js';

export class SqliteEventRepository implements EventRepository {
  private readonly db: SqliteDatabase;
  private readonly insert: SqliteStatement;
  private readonly purge: SqliteStatement;

  constructor(db: SqliteDatabase) {
    this.db = db;
    // Statements are prepared once and reused: less CPU per request.
    this.insert = db.prepare(`
      INSERT INTO tracking_events (
        type, name, occurred_at, visitor_id, session_id, path, is_returning, duration_ms,
        referrer_host, source, medium, campaign, device_type, browser, os,
        country, language, timezone, screen_width, ip_hash
      ) VALUES (
        @type, @name, @occurredAt, @visitorId, @sessionId, @path, @isReturning, @durationMs,
        @referrerHost, @source, @medium, @campaign, @deviceType, @browser, @os,
        @country, @language, @timezone, @screenWidth, @ipHash
      )
    `);
    this.purge = db.prepare('DELETE FROM tracking_events WHERE occurred_at < ?');
  }

  async save(event: TrackingEvent): Promise<void> {
    const p = event.props;
    this.insert.run({
      type: p.type,
      name: p.name?.value ?? null,
      occurredAt: p.occurredAt.getTime(),
      visitorId: p.visitorId.value,
      sessionId: p.sessionId.value,
      path: p.path.value,
      isReturning: p.isReturning ? 1 : 0,
      durationMs: p.durationMs,
      referrerHost: p.traffic.referrerHost,
      source: p.traffic.source,
      medium: p.traffic.medium,
      campaign: p.traffic.campaign,
      deviceType: p.deviceType,
      browser: p.browser,
      os: p.os,
      country: p.country,
      language: p.language,
      timezone: p.timezone,
      screenWidth: p.screenWidth,
      ipHash: p.ipHash,
    });
  }

  async deleteOlderThan(cutoff: Date): Promise<number> {
    return this.purge.run(cutoff.getTime()).changes;
  }

  async clearAll(): Promise<void> {
    this.db.exec("DELETE FROM tracking_events; VACUUM;");
  }
}
