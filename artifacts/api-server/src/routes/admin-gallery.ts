import { Router } from "express";
import { db } from "@workspace/db";
import { gallery } from "@workspace/db";
import { eq, and, isNull, desc } from "drizzle-orm";

const router = Router();

// Admin: list ALL images (pending, approved, rejected)
router.get("/v1/admin/gallery", async (req, res) => {
  try {
    const items = await db
      .select()
      .from(gallery)
      .where(isNull(gallery.deletedAt))
      .orderBy(desc(gallery.createdAt));

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
        createdAt: item.createdAt,
      }))
    );
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: approve or reject an image
router.patch("/v1/admin/gallery/:id/status", async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;
    const { status } = req.body as { status: "approved" | "rejected" | "pending" };

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const [item] = await db
      .update(gallery)
      .set({ status })
      .where(and(eq(gallery.id, id), isNull(gallery.deletedAt)))
      .returning();

    if (!item) return res.status(404).json({ error: "Gallery item not found" });

    return res.json({
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

// Admin: delete an image (soft delete)
router.delete("/v1/admin/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params as Record<string, string>;

    const [item] = await db
      .update(gallery)
      .set({ deletedAt: new Date() })
      .where(and(eq(gallery.id, id), isNull(gallery.deletedAt)))
      .returning();

    if (!item) return res.status(404).json({ error: "Gallery item not found" });

    return res.json({ success: true });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
