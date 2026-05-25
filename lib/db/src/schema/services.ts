import {
  pgTable,
  uuid,
  text,
  decimal,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const serviceUnitEnum = pgEnum("service_unit", [
  "per_person",
  "per_day",
  "per_session",
  "flat_rate",
]);

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  iconEmoji: text("icon_emoji"),
  imageUrl: text("image_url"),
  highlights: text("highlights").array(),
  // Category field:
  // - For Main Packages: "Main Package"
  // - For Optional Packages: "Beginner Surf Packages" | "Advance Surf Packages" | "Yoga Retreat Packages"
  // - For Experiences/Add-ons: "Adventure" | "activities" | "tours" | "wellness"
  category: text("category").notNull(),
  // Type field:
  // - "main" for Surf Main Packages
  // - "optional" for Optional Packages and Add-on Experiences
  type: text("type").default("main").notNull(), // 'main' or 'optional'
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  unit: serviceUnitEnum("unit").notNull(),
  isActive: boolean("is_active").default(true),
  isBookable: boolean("is_bookable").default(true),
  maxCapacity: integer("max_capacity"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const serviceTranslations = pgTable("service_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDesc: text("short_desc"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
