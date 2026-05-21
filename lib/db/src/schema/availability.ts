import { pgTable, uuid, date, boolean, text, timestamp } from "drizzle-orm/pg-core";
import { rooms } from "./rooms";

export const availability = pgTable("availability", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  isBlocked: boolean("is_blocked").notNull().default(false),
  blockReason: text("block_reason"),
  bookingId: uuid("booking_id"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
