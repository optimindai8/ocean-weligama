import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

export const mediaTypeEnum = pgEnum("media_type", ["image", "video"]);
export const galleryStatusEnum = pgEnum("gallery_status", ["pending", "approved", "rejected"]);

export const gallery = pgTable("gallery", {
  id: uuid("id").primaryKey().defaultRandom(),
  mediaType: mediaTypeEnum("media_type").notNull().default("image"),
  status: galleryStatusEnum("status").notNull().default("pending"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  altText: text("alt_text"),
  caption: text("caption"),
  category: text("category"),
  roomId: uuid("room_id"),
  serviceId: uuid("service_id"),
  sortOrder: integer("sort_order").default(0),
  isHero: boolean("is_hero").default(false),
  isFeatured: boolean("is_featured").default(false),
  uploadedBy: uuid("uploaded_by"),
  fileSize: text("file_size"),
  dimensions: text("dimensions"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
