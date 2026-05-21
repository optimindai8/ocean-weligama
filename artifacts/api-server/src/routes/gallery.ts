import { Router } from "express";
import { db } from "@workspace/db";
import { gallery } from "@workspace/db";
import { eq, and, isNull } from "drizzle-orm";

const router = Router();

// Public: list only approved images
router.get("/v1/gallery", async (req, res) => {
  try {
    const { category, limit = "48" } = req.query as Record<string, string>;

    const conditions = [isNull(gallery.deletedAt), eq(gallery.status, "approved")];
    if (category) conditions.push(eq(gallery.category, category));

    const items = await db
      .select()
      .from(gallery)
      .where(and(...conditions))
      .orderBy(gallery.sortOrder)
      .limit(parseInt(limit));

    res.json(
      items.map((item) => ({
        id: item.id,
        mediaType: item.mediaType,
        status: item.status,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        altText: item.altText,
        caption: item.caption,
        category: item.category,
        isFeatured: item.isFeatured,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public: tourist submits an image (pending approval)
router.post("/v1/gallery", async (req, res) => {
  try {
    const { url, category, caption } = req.body as {
      url: string;
      category: string;
      caption?: string | null;
    };

    if (!url || !category) {
      return res.status(400).json({ error: "url and category are required" });
    }

    const [item] = await db
      .insert(gallery)
      .values({
        url,
        category,
        caption: caption ?? null,
        status: "pending",
        mediaType: "image",
        sortOrder: 0,
      })
      .returning();

    return res.status(201).json({
      id: item.id,
      mediaType: item.mediaType,
      status: item.status,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl,
      altText: item.altText,
      caption: item.caption,
      category: item.category,
      isFeatured: item.isFeatured,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
