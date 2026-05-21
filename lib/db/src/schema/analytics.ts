import { pgTable, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";

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
