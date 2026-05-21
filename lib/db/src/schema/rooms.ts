import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roomTypeEnum = pgEnum("room_type", [
  "room",
  "villa",
  "dormitory",
  "suite",
]);
export const roomStatusEnum = pgEnum("room_status", [
  "active",
  "maintenance",
  "hidden",
]);

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  type: roomTypeEnum("type").notNull(),
  status: roomStatusEnum("status").notNull().default("active"),
  maxGuests: integer("max_guests").notNull(),
  bedrooms: integer("bedrooms").notNull().default(1),
  bathrooms: integer("bathrooms").notNull().default(1),
  sizeM2: integer("size_m2"),
  floor: integer("floor").default(0),
  basePricePerNight: decimal("base_price_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }).default(
    "0"
  ),
  currency: text("currency").notNull().default("EUR"),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: integer("sort_order").default(0),
  heroImageUrl: text("hero_image_url"),
  gallery: text("gallery").array(),
  highlights: text("highlights").array(),
  category: text("category").notNull().default("solo"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const roomTranslations = pgTable("room_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  locale: text("locale").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  shortDesc: text("short_desc"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const amenities = pgTable("amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  iconName: text("icon_name").notNull(),
  category: text("category").notNull(),
});

export const roomAmenities = pgTable("room_amenities", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  amenityId: uuid("amenity_id")
    .notNull()
    .references(() => amenities.id),
});
