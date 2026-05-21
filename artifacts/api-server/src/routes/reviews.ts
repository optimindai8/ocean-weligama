import { Router } from "express";
import { db } from "@workspace/db";
import { reviews } from "@workspace/db";
import { eq, and, isNull, desc, sql } from "drizzle-orm";
import { CreateReviewBody } from "@workspace/api-zod";
import crypto from "crypto";

const router = Router();

router.get("/v1/reviews", async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      featured,
    } = req.query as Record<string, string>;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const conditions = [
      eq(reviews.isApproved, true),
      isNull(reviews.deletedAt),
    ];

    if (featured === "true") {
      conditions.push(eq(reviews.isFeatured, true));
    }

    const allReviews = await db
      .select()
      .from(reviews)
      .where(and(...conditions))
      .orderBy(desc(reviews.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(and(...conditions));

    res.json({
      reviews: allReviews,
      total: Number(countResult?.count ?? 0),
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/reviews/summary", async (req, res) => {
  try {
    const approved = await db
      .select({
        ratingOverall: reviews.ratingOverall,
        ratingCleanliness: reviews.ratingCleanliness,
        ratingLocation: reviews.ratingLocation,
        ratingValue: reviews.ratingValue,
      })
      .from(reviews)
      .where(and(eq(reviews.isApproved, true), isNull(reviews.deletedAt)));

    const total = approved.length;
    if (total === 0) {
      res.json({
        averageRating: 0,
        totalReviews: 0,
        averageCleanliness: 0,
        averageLocation: 0,
        averageValue: 0,
        ratingDistribution: { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 },
      });
      return;
    }

    const sum = approved.reduce(
      (acc, r) => ({
        overall: acc.overall + (r.ratingOverall ?? 0),
        cleanliness: acc.cleanliness + (r.ratingCleanliness ?? 0),
        location: acc.location + (r.ratingLocation ?? 0),
        value: acc.value + (r.ratingValue ?? 0),
      }),
      { overall: 0, cleanliness: 0, location: 0, value: 0 }
    );

    const dist: Record<string, number> = { "5": 0, "4": 0, "3": 0, "2": 0, "1": 0 };
    for (const r of approved) {
      const key = String(r.ratingOverall);
      if (key in dist) dist[key]++;
    }

    res.json({
      averageRating: parseFloat((sum.overall / total).toFixed(1)),
      totalReviews: total,
      averageCleanliness: parseFloat((sum.cleanliness / total).toFixed(1)),
      averageLocation: parseFloat((sum.location / total).toFixed(1)),
      averageValue: parseFloat((sum.value / total).toFixed(1)),
      ratingDistribution: dist,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/reviews", async (req, res) => {
  try {
    const validated = CreateReviewBody.safeParse(req.body);
    if (!validated.success) {
      res.status(400).json({ error: "Invalid input", details: validated.error.format() });
      return;
    }

    const { guestName, guestCountry, guestAvatarUrl, ratingOverall, reviewText, title } = validated.data;

    const [newReview] = await db
      .insert(reviews)
      .values({
        id: crypto.randomUUID(),
        guestName,
        guestCountry: guestCountry ?? null,
        guestAvatarUrl: guestAvatarUrl ?? null,
        ratingOverall,
        reviewText,
        title: title ?? null,
        isApproved: false,
        isFeatured: false,
        source: "website",
        createdAt: new Date(),
      })
      .returning();

    res.status(201).json(newReview);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
