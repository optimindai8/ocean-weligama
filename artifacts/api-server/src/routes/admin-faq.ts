import { Router } from "express";
import { db } from "@workspace/db";
import { faqs } from "@workspace/db";
import { eq, isNull, asc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

// Public: list all FAQs (for public FAQ page)
router.get("/v1/faqs", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(faqs)
      .where(isNull(faqs.deletedAt))
      .orderBy(asc(faqs.category), asc(faqs.sortOrder), asc(faqs.createdAt));

    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: list all FAQs
router.get("/v1/admin/faqs", requireAdmin, async (req, res) => {
  try {
    const items = await db
      .select()
      .from(faqs)
      .where(isNull(faqs.deletedAt))
      .orderBy(asc(faqs.category), asc(faqs.sortOrder), asc(faqs.createdAt));

    res.json(items);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: create FAQ
router.post("/v1/admin/faqs", requireAdmin, async (req, res) => {
  try {
    const { category, question, answer, sortOrder } = req.body as {
      category: string;
      question: string;
      answer: string;
      sortOrder?: number;
    };

    if (!category || !question || !answer) {
      return res.status(400).json({ error: "category, question, and answer are required" });
    }

    const [newFaq] = await db
      .insert(faqs)
      .values({ category, question, answer, sortOrder: sortOrder ?? 0 })
      .returning();

    return res.status(201).json(newFaq);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update FAQ
router.patch("/v1/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { category, question, answer, sortOrder } = req.body as {
      category?: string;
      question?: string;
      answer?: string;
      sortOrder?: number;
    };

    const [updated] = await db
      .update(faqs)
      .set({
        ...(category !== undefined && { category }),
        ...(question !== undefined && { question }),
        ...(answer !== undefined && { answer }),
        ...(sortOrder !== undefined && { sortOrder }),
        updatedAt: new Date(),
      })
      .where(eq(faqs.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: "FAQ not found" });

    return res.json(updated);
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete FAQ (soft delete)
router.delete("/v1/admin/faqs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [deleted] = await db
      .update(faqs)
      .set({ deletedAt: new Date() })
      .where(eq(faqs.id, id))
      .returning();

    if (!deleted) return res.status(404).json({ error: "FAQ not found" });

    return res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
