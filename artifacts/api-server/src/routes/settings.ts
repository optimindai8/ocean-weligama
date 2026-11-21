import { Router } from "express";
import { db } from "@workspace/db";
import { siteSettings } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth.js";

const router = Router();

function sanitizeAssetPaths(val: any): any {
  if (typeof val === "string") {
    const s = val.trim();
    if (!s) return val;

    // 1. Only process strings that are genuinely asset paths or media URLs.
    // Plain text, numbers, labels, titles, badges, and suffixes must NEVER be modified.
    const isMedia =
      /https?:\/\//i.test(s) ||
      /^(data:|blob:)/i.test(s) ||
      /^\/?(images|videos|icons|thumbnails)\//i.test(s) ||
      /\.(jpg|jpeg|png|webp|svg|gif|ico|avif|mp4|webm|mov|m4v|ogv)$/i.test(s);

    if (!isMedia) {
      return val;
    }

    // 2. Check if it contains an embedded http:// or https:// anywhere (e.g. "/images/https://...")
    const httpMatch = s.match(/https?:\/\/[^\s"']+/i);
    if (httpMatch) {
      return httpMatch[0];
    }

    // 3. Malformed protocol e.g. "https:/images//images.unsplash.com"
    const malformedHttp = s.match(/https?:\/(?:images|videos)?\/\/([^\s"']+)/i);
    if (malformedHttp) {
      return `https://${malformedHttp[1]}`;
    }

    // 4. Data or blob URLs
    if (/^(data:|blob:)/i.test(s)) return s;

    // 5. Remove duplicate folder prefixes
    let cleaned = s
      .replace(/^(\/?images\/)+/i, "/images/")
      .replace(/^(\/?videos\/)+/i, "/videos/");

    // 6. Ensure leading slash
    if (!cleaned.startsWith("/")) {
      cleaned = "/" + cleaned;
    }

    // 7. Already valid sub-path
    if (/^\/(images|videos|icons|thumbnails)\//i.test(cleaned)) {
      return cleaned;
    }

    // 8. Route root level assets to respective folders
    if (/^\/[^/]+\.(jpg|jpeg|png|webp|svg|gif|ico|avif)$/i.test(cleaned)) {
      return `/images${cleaned}`;
    }
    if (/^\/[^/]+\.(mp4|webm|mov|m4v|ogv)$/i.test(cleaned)) {
      return `/videos${cleaned}`;
    }

    return cleaned;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeAssetPaths);
  }
  if (val !== null && typeof val === "object") {
    const res: Record<string, any> = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = sanitizeAssetPaths(v);
    }
    return res;
  }
  return val;
}

// Get setting value (Public)
router.get("/v1/settings/:key", async (req, res) => {
  try {
    const { key } = req.params as Record<string, string>;
    const [setting] = await db.select().from(siteSettings).where(eq(siteSettings.key, key));
    
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    
    return res.json({
      ...setting,
      value: sanitizeAssetPaths(setting.value),
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Update setting (Admin)
router.patch("/v1/admin/settings/:key", requireAdmin, async (req, res) => {
  try {
    const { key } = req.params as Record<string, string>;
    const { value } = req.body;
    const cleanValue = sanitizeAssetPaths(value);
    
    // Upsert the setting with cleaned, normalized paths
    const [setting] = await db.insert(siteSettings).values({
      key,
      value: cleanValue,
      updatedAt: new Date(),
    }).onConflictDoUpdate({
      target: siteSettings.key,
      set: { value: cleanValue, updatedAt: new Date() },
    }).returning();
    
    return res.json({
      ...setting,
      value: cleanValue,
    });
  } catch (err) {
    req.log.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
