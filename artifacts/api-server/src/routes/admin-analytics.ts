import { Router } from "express";
import { db } from "@workspace/db";
import { bookings, contactMessages } from "@workspace/db";
import { eq, and, isNull, gte, desc, sql } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/v1/admin/analytics/dashboard", requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const monthStart = new Date();
    monthStart.setDate(1);
    const monthStartStr = monthStart.toISOString().slice(0, 10);

    const [todayBookingsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(isNull(bookings.deletedAt), eq(sql`${bookings.createdAt}::date`, sql`${today}::date`)));

    const [monthRevenueResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(total_amount), 0)::text` })
      .from(bookings)
      .where(
        and(
          isNull(bookings.deletedAt),
          gte(bookings.createdAt, monthStart),
          sql`${bookings.status} NOT IN ('cancelled', 'no_show')`
        )
      );

    const [totalBookingsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(isNull(bookings.deletedAt));

    const [pendingResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(isNull(bookings.deletedAt), eq(bookings.status, "pending")));

    const [confirmedResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(isNull(bookings.deletedAt), eq(bookings.status, "confirmed")));

    const [activeGuestsResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(and(isNull(bookings.deletedAt), eq(bookings.status, "checked_in")));

    const [messagesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(and(isNull(contactMessages.deletedAt), eq(contactMessages.isRead, false)));

    res.json({
      todayBookings: Number(todayBookingsResult?.count ?? 0),
      monthRevenue: (monthRevenueResult?.total ?? "0.00"),
      occupancyRate: 0,
      activeGuests: Number(activeGuestsResult?.count ?? 0),
      totalBookings: Number(totalBookingsResult?.count ?? 0),
      pendingBookings: Number(pendingResult?.count ?? 0),
      confirmedBookings: Number(confirmedResult?.count ?? 0),
      recentMessages: Number(messagesResult?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/analytics/bookings-trend", requireAdmin, async (req, res) => {
  try {
    const { days = "30" } = req.query as Record<string, string>;
    const daysNum = parseInt(days);
    const since = new Date();
    since.setDate(since.getDate() - daysNum);

    const allBookings = await db
      .select({
        createdAt: bookings.createdAt,
        totalAmount: bookings.totalAmount,
      })
      .from(bookings)
      .where(
        and(
          isNull(bookings.deletedAt),
          gte(bookings.createdAt, since),
          sql`${bookings.status} NOT IN ('cancelled', 'no_show')`
        )
      )
      .orderBy(bookings.createdAt);

    // Group by date
    const grouped: Record<string, { bookings: number; revenue: number }> = {};
    for (const b of allBookings) {
      const date = new Date(b.createdAt).toISOString().slice(0, 10);
      if (!grouped[date]) grouped[date] = { bookings: 0, revenue: 0 };
      grouped[date].bookings++;
      grouped[date].revenue += parseFloat(b.totalAmount);
    }

    const trend = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        bookings: data.bookings,
        revenue: data.revenue.toFixed(2),
      }));

    res.json(trend);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/admin/analytics/upcoming-checkins", requireAdmin, async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().slice(0, 10);

    const upcoming = await db
      .select()
      .from(bookings)
      .where(
        and(
          isNull(bookings.deletedAt),
          gte(bookings.checkIn, today),
          sql`${bookings.checkIn} <= ${nextWeekStr}`
        )
      )
      .orderBy(bookings.checkIn)
      .limit(20);

    res.json(upcoming.map((b) => ({ ...b, services: [] })));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
