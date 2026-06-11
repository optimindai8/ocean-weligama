import { pgTable, uuid, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";

export const offerAds = pgTable("offer_ads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  intervalMinutes: integer("interval_minutes").default(60).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
