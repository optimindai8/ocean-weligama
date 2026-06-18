import { pgTable, uuid, text, timestamp, boolean, integer, decimal } from "drizzle-orm/pg-core";

export const offerAds = pgTable("offer_ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  intervalMinutes: integer("interval_minutes").default(60).notNull(),
  offerDays: integer("offer_days").default(7).notNull(),
  discountType: text("discount_type").default("percentage").notNull(),
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).default("0").notNull(),
  roomIds: text("room_ids").array().default([]).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
