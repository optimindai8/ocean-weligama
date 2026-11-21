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

    const currentYear = new Date().getFullYear();
    const yearStart = new Date(currentYear, 0, 1);

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

    const [yearRevenueResult] = await db
      .select({ total: sql<string>`COALESCE(SUM(total_amount), 0)::text` })
      .from(bookings)
      .where(
        and(
          isNull(bookings.deletedAt),
          gte(bookings.createdAt, yearStart),
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

    // Active Guests count directly aligned with Guest Details page logic (unique contacts across bookings & messages)
    const allGuestBookings = await db
      .select({ email: bookings.guestEmail })
      .from(bookings)
      .where(isNull(bookings.deletedAt));

    const allGuestMessages = await db
      .select({ email: contactMessages.email })
      .from(contactMessages)
      .where(isNull(contactMessages.deletedAt));

    const uniqueGuestEmails = new Set<string>();
    for (const b of allGuestBookings) {
      if (b.email) uniqueGuestEmails.add(b.email.toLowerCase().trim());
    }
    for (const m of allGuestMessages) {
      if (m.email) uniqueGuestEmails.add(m.email.toLowerCase().trim());
    }
    const guestsCount = uniqueGuestEmails.size;

    const [messagesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(contactMessages)
      .where(and(isNull(contactMessages.deletedAt), eq(contactMessages.isRead, false)));

    res.json({
      todayBookings: Number(todayBookingsResult?.count ?? 0),
      monthRevenue: (monthRevenueResult?.total ?? "0.00"),
      yearRevenue: (yearRevenueResult?.total ?? "0.00"),
      occupancyRate: 0,
      activeGuests: guestsCount,
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

router.get("/v1/admin/analytics/booking-plots", requireAdmin, async (req, res) => {
  try {
    const now = new Date();
    const selectedYear = parseInt(req.query.year as string) || now.getFullYear();
    const selectedMonth = parseInt(req.query.month as string) || (now.getMonth() + 1);

    // Fetch all active bookings (exclude deleted, cancelled, no_show)
    const allBookings = await db
      .select({
        id: bookings.id,
        createdAt: bookings.createdAt,
        checkIn: bookings.checkIn,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
      })
      .from(bookings)
      .where(
        and(
          isNull(bookings.deletedAt),
          sql`${bookings.status} NOT IN ('cancelled', 'no_show')`
        )
      )
      .orderBy(bookings.createdAt);

    // 1. DAILY BOOKINGS (1 to 31 for the selected month and year)
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const dailyMap: Record<number, { count: number; revenue: number }> = {};
    for (let d = 1; d <= daysInMonth; d++) {
      dailyMap[d] = { count: 0, revenue: 0 };
    }

    // 2. MONTHLY BOOKINGS (January to December for selected year)
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<number, { count: number; revenue: number }> = {};
    for (let m = 1; m <= 12; m++) {
      monthlyMap[m] = { count: 0, revenue: 0 };
    }

    // 3. YEARLY BOOKINGS (2023, 2024, 2025, 2026...)
    const yearlyMap: Record<number, { count: number; revenue: number }> = {};
    const baseYears = [2023, 2024, 2025, 2026];
    for (const y of baseYears) {
      yearlyMap[y] = { count: 0, revenue: 0 };
    }

    let totalValidBookings = 0;
    let yearBookingsCount = 0;
    let monthBookingsCount = 0;
    let totalRevenueAmount = 0;
    let yearRevenueAmount = 0;
    let monthRevenueAmount = 0;

    for (const b of allBookings) {
      totalValidBookings++;
      const bDate = new Date(b.createdAt);
      const bYear = bDate.getFullYear();
      const bMonth = bDate.getMonth() + 1;
      const bDay = bDate.getDate();
      const amount = parseFloat(b.totalAmount || "0") || 0;
      totalRevenueAmount += amount;

      if (!yearlyMap[bYear]) {
        yearlyMap[bYear] = { count: 0, revenue: 0 };
      }
      yearlyMap[bYear].count++;
      yearlyMap[bYear].revenue += amount;

      if (bYear === selectedYear) {
        yearBookingsCount++;
        yearRevenueAmount += amount;
        if (monthlyMap[bMonth]) {
          monthlyMap[bMonth].count++;
          monthlyMap[bMonth].revenue += amount;
        }

        if (bMonth === selectedMonth) {
          monthBookingsCount++;
          monthRevenueAmount += amount;
          if (dailyMap[bDay]) {
            dailyMap[bDay].count++;
            dailyMap[bDay].revenue += amount;
          }
        }
      }
    }

    const daily = Object.entries(dailyMap).map(([dayStr, val]) => {
      const dayNum = parseInt(dayStr);
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
      return {
        day: dayNum,
        date: dateStr,
        bookings: val.count,
        revenue: val.revenue.toFixed(2),
      };
    }).sort((a, b) => a.day - b.day);

    const monthly = Object.entries(monthlyMap).map(([mNumStr, val]) => {
      const mNum = parseInt(mNumStr);
      return {
        month: MONTH_NAMES[mNum - 1],
        monthNum: mNum,
        bookings: val.count,
        revenue: val.revenue.toFixed(2),
      };
    }).sort((a, b) => a.monthNum - b.monthNum);

    const yearly = Object.entries(yearlyMap).map(([yStr, val]) => ({
      year: yStr,
      bookings: val.count,
      revenue: val.revenue.toFixed(2),
    })).sort((a, b) => parseInt(a.year) - parseInt(b.year));

    res.json({
      selectedYear,
      selectedMonth,
      daily,
      monthly,
      yearly,
      totalBookings: totalValidBookings,
      monthBookings: monthBookingsCount,
      yearBookings: yearBookingsCount,
      totalRevenue: totalRevenueAmount.toFixed(2),
      monthRevenue: monthRevenueAmount.toFixed(2),
      yearRevenue: yearRevenueAmount.toFixed(2),
    });
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
