import {
  pgTable,
  uuid,
  date,
  decimal,
  text,
  timestamp,
  boolean,
  unique,
} from "drizzle-orm/pg-core";
import { rooms } from "./rooms";
import { services } from "./services";

export const pricingRules = pgTable("pricing_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  dateFrom: date("date_from").notNull(),
  dateTo: date("date_to").notNull(),
  pricePerNight: decimal("price_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  minNights: text("min_nights").default("1"),
  isActive: boolean("is_active").default(true),
  priority: text("priority").default("10"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const roomPackagePrices = pgTable(
  "room_package_prices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    roomId: uuid("room_id")
      .notNull()
      .references(() => rooms.id, { onDelete: "cascade" }),
    packageId: uuid("package_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    dailyPrice: decimal("daily_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    unq: unique("room_package_unq").on(table.roomId, table.packageId),
  })
);

export const globalRateAdjustments = pgTable("global_rate_adjustments", {
  id: uuid("id").primaryKey().defaultRandom(),
  seasonName: text("season_name").notNull(),
  dateFrom: timestamp("date_from", { withTimezone: true }),
  dateTo: timestamp("date_to", { withTimezone: true }),
  
  roomAdjustmentType: text("room_adj_type").default("fixed"),
  roomAdjustmentValue: decimal("room_adj_value", { precision: 10, scale: 2 }).default("0"),
  
  experienceAdjustmentType: text("exp_adj_type").default("fixed"),
  experienceAdjustmentValue: decimal("exp_adj_value", { precision: 10, scale: 2 }).default("0"),
  
  packageAdjustmentType: text("pkg_adj_type").default("fixed"),
  packageAdjustmentValue: decimal("pkg_adj_value", { precision: 10, scale: 2 }).default("0"),

  isActive: boolean("is_active").default(false),
  
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

