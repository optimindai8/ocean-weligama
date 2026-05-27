import { Router } from "express";
import { db } from "@workspace/db";
import {
  services,
  serviceTranslations,
  reviews,
  contactMessages,
  pricingRules,
  availability,
  bookings,
  gallery,
} from "@workspace/db";
import { eq, and, isNull, desc, ne } from "drizzle-orm";
import { requireAdmin } from "../lib/auth";
const router = Router();

// Admin Services
// Admin Services
router.get("/v1/admin/services", requireAdmin, async (req, res) => {
  try {
    const allServices = await db
      .select()
      .from(services)
      .orderBy(services.sortOrder);

    const enriched = await Promise.all(
      allServices.map(async (s) => {
        const translations = await db
          .select()
          .from(serviceTranslations)
          .where(eq(serviceTranslations.serviceId, s.id));
        const en = translations.find((t) => t.locale === "en") ?? translations[0];
        return {
          ...s,
          name: en?.name ?? s.slug,
          description: en?.description ?? "",
          shortDesc: en?.shortDesc ?? null,
        };
      })
    );

    return res.json(enriched);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/services", requireAdmin, async (req, res) => {
  try {
    const { name, description, shortDesc, ...serviceFields } = req.body;

    // Production-grade transaction: Atomic creation of service + translation
    const result = await db.transaction(async (tx) => {
      let finalSlug = serviceFields.slug;
      let counter = 1;
      while (true) {
        const existing = await tx.select().from(services).where(eq(services.slug, finalSlug));
        if (existing.length === 0) break;
        finalSlug = `${serviceFields.slug}-${counter}`;
        counter++;
      }
      serviceFields.slug = finalSlug;

      // 2. Insert Core Service
      const [service] = await tx
        .insert(services)
        .values({
          ...serviceFields,
          unit: serviceFields.unit ?? "flat_rate",
          isActive: serviceFields.isActive ?? true,
          isBookable: serviceFields.isBookable ?? true,
          isFeatured: serviceFields.isFeatured ?? false,
          sortOrder: serviceFields.sortOrder ?? 0,
        })
        .returning();
      // 3. Insert English Translation
      await tx.insert(serviceTranslations).values({
        serviceId: service.id,
        locale: "en",
        name,
        description: description || "",
        shortDesc: shortDesc || null,
      });

      return { ...service, name, description, shortDesc };
    });

    req.log.info({ serviceId: result.id }, "New service created successfully");
    return res.status(201).json(result);
  } catch (err) {
    req.log.error(err);
    if (err instanceof Error && err.message.startsWith("DUPLICATE_SLUG")) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
  }
});

router.patch("/v1/admin/services/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { name, description, shortDesc, ...serviceFields } = req.body;

    // Production-grade update with transaction
    const result = await db.transaction(async (tx) => {
      // 1. If slug is changing, check for duplicates
      if (serviceFields.slug) {
        let finalSlug = serviceFields.slug;
        let counter = 1;
        while (true) {
          const existing = await tx
            .select()
            .from(services)
            .where(and(eq(services.slug, finalSlug), ne(services.id, id)));
          if (existing.length === 0) break;
          finalSlug = `${serviceFields.slug}-${counter}`;
          counter++;
        }
        serviceFields.slug = finalSlug;
      }

      // 2. Update Core Service
      const [updated] = await tx
        .update(services)
        .set({ ...serviceFields, updatedAt: new Date() })
        .where(eq(services.id, id))
        .returning();

      if (!updated) {
        throw new Error("NOT_FOUND: Service not found");
      }

      // 3. Update English Translation
      if (name || description !== undefined || shortDesc !== undefined) {
        const existingTrans = await tx
          .select()
          .from(serviceTranslations)
          .where(and(eq(serviceTranslations.serviceId, id), eq(serviceTranslations.locale, "en")));

        if (existingTrans.length > 0) {
          await tx
            .update(serviceTranslations)
            .set({
              name: name ?? existingTrans[0].name,
              description: description ?? existingTrans[0].description,
              shortDesc: shortDesc ?? existingTrans[0].shortDesc,
            })
            .where(eq(serviceTranslations.id, existingTrans[0].id));
        } else {
          // Create translation if it doesn't exist for some reason
          await tx.insert(serviceTranslations).values({
            serviceId: id,
            locale: "en",
            name: name ?? updated.slug,
            description: description ?? "",
            shortDesc: shortDesc ?? null,
          });
        }
      }

      return { ...updated, name, description, shortDesc };
    });

    return res.json(result);
  } catch (err) {
    req.log.error(err);
    if (err instanceof Error) {
      if (err.message.startsWith("DUPLICATE_SLUG")) return res.status(400).json({ error: err.message });
      if (err.message.startsWith("NOT_FOUND")) return res.status(404).json({ error: "Service not found" });
      return res.status(500).json({ error: err.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/services/:id", requireAdmin, async (req, res) => {
  try {
    req.log.info({ id: req.params.id }, "DELETE request received");
    const { id } = req.params as Record<string, string>;
    
    // Hard delete service (translations will be cascade deleted)
    const [deleted] = await db.delete(services).where(eq(services.id, id)).returning();
    
    if (!deleted) {
      return res.status(404).json({ error: "Service not found" });
    }

    req.log.info({ serviceId: id }, "Service deleted successfully");
    return res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: err instanceof Error ? err.message : "Internal server error" });
  }
});

// Admin Reviews
router.get("/v1/admin/reviews", requireAdmin, async (req, res) => {
  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .where(isNull(reviews.deletedAt))
      .orderBy(desc(reviews.createdAt));

    return res.json(allReviews);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/reviews/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { isApproved, isFeatured, ownerReply } = req.body;

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (isApproved !== undefined) updates.isApproved = isApproved;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (ownerReply !== undefined) updates.ownerReply = ownerReply;

    const [updated] = await db
      .update(reviews)
      .set(updates)
      .where(eq(reviews.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/reviews/:id", requireAdmin, async (req, res) => {
  const { id } = req.params as Record<string, string>;
  req.log.info({ id }, "Admin review delete requested");

  try {
    // 1. Fetch the review
    const [review] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, id));

    if (!review) {
      req.log.warn({ id }, "Review not found for deletion");
      return res.status(404).json({ error: "Review not found" });
    }

    // 2. Storage Deletion (Attempt)
    if (review.guestAvatarUrl && review.guestAvatarUrl.includes("supabase.co")) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL;
        // Try Service Role Key first for bypass RLS
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (supabaseUrl && supabaseKey) {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(supabaseUrl, supabaseKey);
          
          const urlParts = review.guestAvatarUrl.split("/guest-reviews/");
          if (urlParts.length > 1) {
            const filePath = urlParts[1];
            req.log.info({ filePath }, "Attempting to delete image from storage");
            const { error: storageError } = await supabase.storage.from("guest-reviews").remove([filePath]);
            if (storageError) req.log.error({ storageError }, "Storage removal error (non-fatal)");
          }
        }
      } catch (storageErr) {
        req.log.error({ storageErr }, "Supabase storage logic failed (non-fatal)");
      }
    }

    // 3. Database Deletion
    req.log.info({ id }, "Deleting review from database");
    await db.delete(reviews).where(eq(reviews.id, id));

    req.log.info({ id }, "Review deleted successfully");
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err, id }, "CRITICAL: Review deletion failed");
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin Messages
router.get("/v1/admin/messages", requireAdmin, async (req, res) => {
  try {
    const { isRead, limit = "20" } = req.query as Record<string, string>;

    const conditions = [isNull(contactMessages.deletedAt)];
    if (isRead !== undefined) {
      conditions.push(eq(contactMessages.isRead, isRead === "true"));
    }

    const msgs = await db
      .select()
      .from(contactMessages)
      .where(and(...conditions))
      .orderBy(desc(contactMessages.createdAt))
      .limit(parseInt(limit));

    return res.json(msgs);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/messages/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { isRead, isReplied } = req.body;

    const updates: Record<string, unknown> = {};
    if (isRead !== undefined) updates.isRead = isRead;
    if (isReplied !== undefined) {
      updates.isReplied = isReplied;
      if (isReplied) updates.repliedAt = new Date();
    }

    const [updated] = await db
      .update(contactMessages)
      .set(updates)
      .where(eq(contactMessages.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/messages/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin Pricing Rules
router.get("/v1/admin/pricing", requireAdmin, async (req, res) => {
  try {
    const rules = await db.select().from(pricingRules).orderBy(pricingRules.dateFrom);
    return res.json(rules);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/pricing", requireAdmin, async (req, res) => {
  try {
    const [rule] = await db.insert(pricingRules).values(req.body).returning();
    return res.status(201).json(rule);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/pricing/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const [updated] = await db
      .update(pricingRules)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(pricingRules.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/pricing/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    await db.delete(pricingRules).where(eq(pricingRules.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin Availability
router.get("/v1/admin/availability/:roomId", requireAdmin, async (req, res) => {
  try {
    const { roomId } = req.params as Record<string, string>;
    const avail = await db
      .select()
      .from(availability)
      .where(eq(availability.roomId, roomId));

    return res.json(avail.map((a) => ({
      date: a.date,
      isBlocked: a.isBlocked,
      blockReason: a.blockReason,
    })));
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/availability/block", requireAdmin, async (req, res) => {
  try {
    const { roomId, dates, blockReason } = req.body;

    await db.insert(availability).values(
      dates.map((date: string) => ({
        roomId,
        date,
        isBlocked: true,
        blockReason,
      }))
    );

    return res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/availability/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    await db.delete(availability).where(eq(availability.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin Notifications
router.get("/v1/admin/notifications/counts", requireAdmin, async (req, res) => {
  try {
    const unreadBookings = await db.select({ id: bookings.id }).from(bookings).where(and(eq(bookings.status, "pending"), isNull(bookings.deletedAt)));
    const unreadReviews = await db.select({ id: reviews.id }).from(reviews).where(and(eq(reviews.isApproved, false), isNull(reviews.deletedAt)));
    const unreadMessages = await db.select({ id: contactMessages.id }).from(contactMessages).where(and(eq(contactMessages.isRead, false), isNull(contactMessages.deletedAt)));
    const unreadGallery = await db.select({ id: gallery.id }).from(gallery).where(and(eq(gallery.status, "pending"), isNull(gallery.deletedAt)));

    return res.json({
      bookings: unreadBookings.length,
      reviews: unreadReviews.length,
      messages: unreadMessages.length,
      gallery: unreadGallery.length,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/notifications/mark-read", requireAdmin, async (req, res) => {
  try {
    const { type } = req.body;
    
    switch (type) {
      case "bookings":
        await db.update(bookings).set({ isRead: true }).where(eq(bookings.isRead, false));
        break;
      case "reviews":
        await db.update(reviews).set({ isRead: true }).where(eq(reviews.isRead, false));
        break;
      case "messages":
        await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.isRead, false));
        break;
      case "gallery":
        await db.update(gallery).set({ isRead: true }).where(eq(gallery.isRead, false));
        break;
      default:
        return res.status(400).json({ error: "Invalid type" });
    }
    
    return res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
