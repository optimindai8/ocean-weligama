import { pgTable, uuid, text, timestamp, integer, bigint, index, serial } from "drizzle-orm/pg-core";

export const trackingEvents = pgTable(
  "tracking_events",
  {
    id: serial("id").primaryKey(),
    type: text("type").notNull(),
    name: text("name"),
    occurredAt: bigint("occurred_at", { mode: "number" }).notNull(),
    visitorId: text("visitor_id").notNull(),
    sessionId: text("session_id").notNull(),
    path: text("path").notNull(),
    isReturning: integer("is_returning").notNull().default(0),
    durationMs: integer("duration_ms"),
    referrerHost: text("referrer_host"),
    source: text("source").notNull().default("direct"),
    medium: text("medium").notNull().default("none"),
    campaign: text("campaign"),
    deviceType: text("device_type").notNull().default("desktop"),
    browser: text("browser").notNull().default("Other"),
    os: text("os").notNull().default("Other"),
    country: text("country"),
    language: text("language"),
    timezone: text("timezone"),
    screenWidth: integer("screen_width"),
    ipHash: text("ip_hash").notNull(),
    ip: text("ip"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("idx_tracking_events_type_time").on(table.type, table.occurredAt),
    index("idx_tracking_events_time").on(table.occurredAt),
  ]
);

export type TrackingEventRow = typeof trackingEvents.$inferSelect;
export type InsertTrackingEventRow = typeof trackingEvents.$inferInsert;

export const pageViews = pgTable("page_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  page: text("page").notNull(),
  referrer: text("referrer"),
  userAgent: text("user_agent"),
  countryCode: text("country_code"),
  city: text("city"),
  deviceType: text("device_type"),
  language: text("language"),
  duration: integer("duration"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const conversionEvents = pgTable("conversion_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
