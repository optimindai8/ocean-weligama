import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { bookings } from "./bookings";

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id").references(() => bookings.id),
  guestName: text("guest_name").notNull(),
  guestCountry: text("guest_country"),
  guestAvatarUrl: text("guest_avatar_url"),
  ratingOverall: integer("rating_overall").notNull(),
  ratingCleanliness: integer("rating_cleanliness"),
  ratingLocation: integer("rating_location"),
  ratingValue: integer("rating_value"),
  title: text("title"),
  reviewText: text("review_text").notNull(),
  ownerReply: text("owner_reply"),
  isApproved: boolean("is_approved").default(false),
  isFeatured: boolean("is_featured").default(false),
  source: text("source").default("website"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
