import { Router } from "express";
import { db } from "@workspace/db";
import { contactMessages, pageViews } from "@workspace/db";

const router = Router();

router.post("/v1/contact", async (req, res) => {
  try {
    const { fullName, email, phone, subject, message, countryCode } = req.body;

    if (!fullName || !email || !message) {
      res.status(400).json({ error: "fullName, email, and message are required" });
      return;
    }

    await db.insert(contactMessages).values({
      fullName,
      email,
      phone,
      subject,
      message,
      countryCode,
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! We will respond within 24 hours.",
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/v1/analytics/track", async (req, res) => {
  try {
    const { sessionId, page, referrer, deviceType, language, duration } = req.body;

    await db.insert(pageViews).values({
      sessionId,
      page,
      referrer,
      deviceType,
      language,
      duration,
    });

    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
