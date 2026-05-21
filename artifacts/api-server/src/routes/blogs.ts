import { Router } from "express";
import { db } from "@workspace/db";
import { blogs } from "@workspace/db";
import { eq, isNull, and, desc } from "drizzle-orm";

const router = Router();

router.get("/v1/blogs", async (req, res) => {
  try {
    const { category } = req.query as Record<string, string>;
    
    const conditions = [isNull(blogs.deletedAt)];
    if (category && category !== "All") {
      conditions.push(eq(blogs.category, category as any));
    }

    const allBlogs = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .orderBy(desc(blogs.date));

    res.json(allBlogs);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/v1/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [blog] = await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.id, id), isNull(blogs.deletedAt)));

    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.json(blog);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
