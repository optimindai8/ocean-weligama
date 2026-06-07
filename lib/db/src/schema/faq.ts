import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export const faqs = pgTable("faqs", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});
