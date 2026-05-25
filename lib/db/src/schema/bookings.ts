import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  pgEnum,
  date,
} from "drizzle-orm/pg-core";
import { rooms } from "./rooms";

export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "unpaid",
  "partial",
  "paid",
  "refunded",
  "failed",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "online_card",
  "bank_transfer",
  "cash",
  "pending",
]);

export const bookings = pgTable("bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  reference: text("reference").notNull().unique(),
  roomId: uuid("room_id")
    .references(() => rooms.id),
  checkIn: date("check_in").notNull(),
  checkOut: date("check_out").notNull(),
  nights: integer("nights").notNull(),
  guestCount: integer("guest_count").notNull(),

  guestFullName: text("guest_full_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  guestPhone: text("guest_phone").notNull(),
  guestNationality: text("guest_nationality"),
  guestCountryCode: text("guest_country_code"),
  specialRequests: text("special_requests"),

  roomRatePerNight: decimal("room_rate_per_night", {
    precision: 10,
    scale: 2,
  }).notNull(),
  roomSubtotal: decimal("room_subtotal", {
    precision: 10,
    scale: 2,
  }).notNull(),
  servicesSubtotal: decimal("services_subtotal", {
    precision: 10,
    scale: 2,
  }).default("0"),
  cleaningFee: decimal("cleaning_fee", { precision: 10, scale: 2 }).default(
    "0"
  ),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  depositAmount: decimal("deposit_amount", {
    precision: 10,
    scale: 2,
  }).default("0"),

  status: bookingStatusEnum("status").notNull().default("pending"),
  paymentStatus: paymentStatusEnum("payment_status")
    .notNull()
    .default("unpaid"),
  paymentMethod: paymentMethodEnum("payment_method")
    .notNull()
    .default("pending"),
  paymentReference: text("payment_reference"),

  bookingSource: text("booking_source").default("website"),
  languageUsed: text("language_used").default("en"),
  adminNotes: text("admin_notes"),
  isConfirmedEmail: boolean("is_confirmed_email").default(false),
  isRead: boolean("is_read").default(false),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  deletedAt: timestamp("deleted_at", { withTimezone: true }),
});

export const bookingServices = pgTable("booking_services", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  serviceId: uuid("service_id").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
});

export const bookingRooms = pgTable("booking_rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookingId: uuid("booking_id")
    .notNull()
    .references(() => bookings.id, { onDelete: "cascade" }),
  roomId: uuid("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
});
