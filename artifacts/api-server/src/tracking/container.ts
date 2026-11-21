import path from "node:path";
import { pool } from "@workspace/db";
import { PostgresEventRepository } from "./infrastructure/persistence/postgres/PostgresEventRepository.js";
import { PostgresAnalyticsQuery } from "./infrastructure/persistence/postgres/PostgresAnalyticsQuery.js";
import { openDatabase, type SqliteDatabase } from "./infrastructure/persistence/sqlite/openDatabase.js";
import { SqliteEventRepository } from "./infrastructure/persistence/sqlite/SqliteEventRepository.js";
import { SqliteAnalyticsQuery } from "./infrastructure/persistence/sqlite/SqliteAnalyticsQuery.js";
import { HmacIpHasher } from "./infrastructure/security/HmacIpHasher.js";
import { RegexUserAgentParser } from "./infrastructure/services/RegexUserAgentParser.js";
import { RegexBotDetector } from "./infrastructure/services/RegexBotDetector.js";
import { SystemClock } from "./infrastructure/services/SystemClock.js";
import { RecordTrackingEvent } from "./application/use-cases/RecordTrackingEvent.js";
import { GetDashboardAnalytics } from "./application/use-cases/GetDashboardAnalytics.js";
import { PurgeExpiredEvents } from "./application/use-cases/PurgeExpiredEvents.js";
import type { EventRepository } from "./application/ports/EventRepository.js";
import type { AnalyticsQuery } from "./application/ports/AnalyticsQuery.js";

export interface TrackingContainer {
  recordTrackingEvent: RecordTrackingEvent;
  getDashboardAnalytics: GetDashboardAnalytics;
  purgeExpiredEvents: PurgeExpiredEvents;
  resetAllEvents: () => Promise<void>;
  close: () => void;
}

let instance: TrackingContainer | null = null;

export function getTrackingContainer(): TrackingContainer {
  if (instance) return instance;

  const secret = process.env.SESSION_SECRET || process.env.JWT_SECRET || "ocean-air-tracking-secret-key-2026-weligama-bay";
  const utcOffsetMinutes = parseInt(process.env.TRACKING_UTC_OFFSET || "330", 10); // Sri Lanka UTC+5:30 = 330 mins

  let events: EventRepository;
  let query: AnalyticsQuery;
  let closeFn = () => {};

  // Connect to Supabase PostgreSQL as primary database
  if (pool && process.env.DATABASE_URL) {
    events = new PostgresEventRepository(pool);
    query = new PostgresAnalyticsQuery(pool);
  } else {
    const dbPath = process.env.TRACKING_DATABASE_PATH || path.resolve(process.cwd(), "data/analytics.db");
    const db = openDatabase(dbPath);
    events = new SqliteEventRepository(db);
    query = new SqliteAnalyticsQuery(db);
    closeFn = () => db.close();
  }

  const ipHasher = new HmacIpHasher(secret);
  const userAgents = new RegexUserAgentParser();
  const bots = new RegexBotDetector();
  const clock = new SystemClock();

  const recordTrackingEvent = new RecordTrackingEvent({
    events,
    ipHasher,
    userAgents,
    bots,
    clock,
  });

  const getDashboardAnalytics = new GetDashboardAnalytics({
    query,
    clock,
    utcOffsetMinutes,
  });

  const purgeExpiredEvents = new PurgeExpiredEvents({
    events,
    clock,
    retentionDays: 395,
  });

  const resetAllEvents = async () => {
    await events.clearAll();
  };

  instance = {
    recordTrackingEvent,
    getDashboardAnalytics,
    purgeExpiredEvents,
    resetAllEvents,
    close: closeFn,
  };

  return instance;
}
