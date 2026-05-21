import { pgTable, uuid, decimal, integer, timestamp } from "drizzle-orm/pg-core";

export const airportPricing = pgTable("airport_pricing", {
  id: uuid("id").primaryKey().defaultRandom(),
  pickupPrice: decimal("pickup_price", { precision: 10, scale: 2 }).notNull().default("75.00"),
  pickupPriceGroup: decimal("pickup_price_group", { precision: 10, scale: 2 }).notNull().default("100.00"),
  dropPrice: decimal("drop_price", { precision: 10, scale: 2 }).notNull().default("65.00"),
  dropPriceGroup: decimal("drop_price_group", { precision: 10, scale: 2 }).notNull().default("100.00"),
  groupThreshold: integer("group_threshold").notNull().default(4),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
