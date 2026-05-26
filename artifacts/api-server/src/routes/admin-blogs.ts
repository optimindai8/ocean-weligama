import { Router } from "express";
import { db } from "@workspace/db";
import { blogs } from "@workspace/db";
import { eq, isNull, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

router.get("/v1/admin/blogs", requireAdmin, async (req, res) => {
  try {
    const allBlogs = await db
      .select()
      .from(blogs)
      .where(isNull(blogs.deletedAt))
      .orderBy(desc(blogs.date));

    res.json(allBlogs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/admin/blogs", requireAdmin, async (req, res) => {
  try {
    const body = req.body;

    const [newBlog] = await db
      .insert(blogs)
      .values({
        title: body.title,
        description: body.description,
        image: body.image,
        category: body.category,
        date: new Date(body.date),
        isFeatured: body.isFeatured ?? false,
      })
      .returning();

    res.status(201).json(newBlog);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/v1/admin/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const body = req.body;

    const [updatedBlog] = await db
      .update(blogs)
      .set({
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.image && { image: body.image }),
        ...(body.category && { category: body.category }),
        ...(body.date && { date: new Date(body.date) }),
        ...(body.isFeatured !== undefined && { isFeatured: body.isFeatured }),
        updatedAt: new Date(),
      })
      .where(eq(blogs.id, id))
      .returning();

    if (!updatedBlog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.json(updatedBlog);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/v1/admin/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [deleted] = await db
      .update(blogs)
      .set({ deletedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();

    if (!deleted) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
