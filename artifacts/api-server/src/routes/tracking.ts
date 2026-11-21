import { Router, type Request, type Response } from "express";
import { getTrackingContainer } from "../tracking/container.js";
import { isReportPeriod, type ReportPeriod } from "../tracking/domain/value-objects/ReportPeriod.js";
import { requireAdmin } from "../security/auth.js";
import { logger } from "../lib/logger.js";

const router = Router();

let cachedWanPublicIp = "";
let lastWanLookup = 0;
const WAN_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

export async function resolveLiveWanPublicIp(): Promise<string> {
  const now = Date.now();
  if (cachedWanPublicIp && now - lastWanLookup < WAN_CACHE_TTL) {
    return cachedWanPublicIp;
  }

  const endpoints = [
    { url: "https://api64.ipify.org?format=json", json: true },
    { url: "https://api.ipify.org?format=json", json: true },
    { url: "https://icanhazip.com", json: false },
    { url: "https://ifconfig.me/ip", json: false },
  ];

  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        let ip = "";
        if (ep.json) {
          const data = (await res.json()) as any;
          ip = data && typeof data.ip === "string" ? data.ip : "";
        } else {
          ip = await res.text();
        }
        ip = cleanIp(ip);
        if (ip && !isLocalIp(ip)) {
          cachedWanPublicIp = ip;
          lastWanLookup = now;
          return ip;
        }
      }
    } catch {}
  }
  return cachedWanPublicIp || "";
}

// Background pre-fetch
resolveLiveWanPublicIp().catch(() => {});

function isLocalIp(ip: string): boolean {
  if (!ip) return true;
  const s = ip.trim();
  return (
    s === "127.0.0.1" ||
    s === "::1" ||
    s === "localhost" ||
    s.startsWith("127.") ||
    s.startsWith("169.254.") ||
    s.startsWith("::ffff:127.") ||
    s.startsWith("10.") ||
    s.startsWith("192.168.") ||
    s.startsWith("172.16.") ||
    s.startsWith("172.17.") ||
    s.startsWith("172.18.") ||
    s.startsWith("172.19.") ||
    s.startsWith("172.20.") ||
    s.startsWith("172.21.") ||
    s.startsWith("172.22.") ||
    s.startsWith("172.23.") ||
    s.startsWith("172.24.") ||
    s.startsWith("172.25.") ||
    s.startsWith("172.26.") ||
    s.startsWith("172.27.") ||
    s.startsWith("172.28.") ||
    s.startsWith("172.29.") ||
    s.startsWith("172.30.") ||
    s.startsWith("172.31.")
  );
}

function cleanIp(ip: string): string {
  let cleaned = (ip || "").trim();
  if (cleaned.startsWith("::ffff:")) {
    cleaned = cleaned.replace("::ffff:", "");
  }
  if (cleaned === "::1") {
    cleaned = "127.0.0.1";
  }
  return cleaned;
}

function getClientIp(req: Request, payload?: any): string {
  // 1. Direct Cloudflare connecting header
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.trim() && !isLocalIp(cfIp)) {
    return cleanIp(cfIp);
  }

  // 2. Akamai / Cloudflare Enterprise True-Client-IP header
  const trueClientIp = req.headers["true-client-ip"];
  if (typeof trueClientIp === "string" && trueClientIp.trim() && !isLocalIp(trueClientIp)) {
    return cleanIp(trueClientIp);
  }

  // 3. Nginx / reverse proxy X-Real-IP header
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp.trim() && !isLocalIp(realIp)) {
    return cleanIp(realIp);
  }

  // 4. X-Client-IP header
  const xClientIp = req.headers["x-client-ip"];
  if (typeof xClientIp === "string" && xClientIp.trim() && !isLocalIp(xClientIp)) {
    return cleanIp(xClientIp);
  }

  // 5. Standard X-Forwarded-For proxy chain: take the first valid public IP
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    const parts = forwarded.split(",").map((s) => cleanIp(s)).filter((s) => !isLocalIp(s));
    if (parts.length > 0) return parts[0];
  } else if (Array.isArray(forwarded) && forwarded.length > 0) {
    const parts = forwarded.map((s) => cleanIp(String(s))).filter((s) => !isLocalIp(s));
    if (parts.length > 0) return parts[0];
  }

  // 6. Real public IP delivered directly by client-side browser telemetry beacon
  if (payload && typeof payload.ip === "string" && payload.ip.trim() && !isLocalIp(payload.ip)) {
    return cleanIp(payload.ip);
  }

  // 7. Express trusted remote address
  const rawIp = req.ip || req.socket.remoteAddress || "";
  const cleanedRaw = cleanIp(rawIp);
  if (cleanedRaw && !isLocalIp(cleanedRaw)) {
    return cleanedRaw;
  }

  // 8. If testing/running on localhost or developer network, dynamically use the live WAN IP
  if (cachedWanPublicIp) {
    return cachedWanPublicIp;
  }

  return cleanedRaw || "127.0.0.1";
}

function parseTrackingBody(body: unknown): any {
  if (typeof body === "string") {
    if (!body.trim()) return null;
    try {
      return JSON.parse(body);
    } catch {
      return null;
    }
  }
  if (body && typeof body === "object") {
    return body;
  }
  return null;
}

/**
 * Public ingestion endpoint for visitor tracking events.
 * Accepts beacon text/plain and JSON payloads with minimal latency.
 */
async function handleCollect(req: Request, res: Response): Promise<void> {
  try {
    const payload = parseTrackingBody(req.body);
    if (!payload || typeof payload !== "object") {
      res.status(204).end();
      return;
    }

    const { type, visitorId, sessionId, path: eventPath } = payload;
    if (!type || !visitorId || !sessionId || !eventPath) {
      res.status(204).end();
      return;
    }

    // Exclude internal admin panel requests
    const normPath = String(eventPath).toLowerCase();
    if (
      normPath.startsWith("/ow-admin") ||
      normPath.startsWith("/admin") ||
      normPath.includes("/admin/")
    ) {
      res.status(204).end();
      return;
    }

    const container = getTrackingContainer();
    const userAgent = req.get("user-agent") || "";
    const ip = getClientIp(req, payload);
    const countryHint = (
      req.get("cf-ipcountry") ||
      req.get("x-country-code") ||
      req.get("x-vercel-ip-country") ||
      req.get("cloudfront-viewer-country") ||
      req.get("fastly-client-ip-country") ||
      req.get("x-real-ip-country") ||
      payload.country ||
      null
    ) as string | null;

    const normalizedType = type === "event" ? "custom" : type;
    if (normalizedType !== "pageview" && normalizedType !== "engagement" && normalizedType !== "custom") {
      res.status(204).end();
      return;
    }

    await container.recordTrackingEvent.execute({
      type: normalizedType,
      ...(payload.name ? { name: String(payload.name).slice(0, 40) } : {}),
      visitorId: String(visitorId).slice(0, 36),
      sessionId: String(sessionId).slice(0, 36),
      path: String(eventPath).slice(0, 300),
      returning: Boolean(payload.returning),
      ...(payload.durationMs !== undefined ? { durationMs: Math.max(1, Math.min(7200000, Number(payload.durationMs))) } : {}),
      ...(payload.referrer ? { referrer: String(payload.referrer).slice(0, 500) } : {}),
      ...(payload.utmSource ? { utmSource: String(payload.utmSource).slice(0, 100) } : {}),
      ...(payload.utmCampaign ? { utmCampaign: String(payload.utmCampaign).slice(0, 150) } : {}),
      ...(payload.screenWidth !== undefined ? { screenWidth: Math.max(1, Math.min(20000, Number(payload.screenWidth))) } : {}),
      ...(payload.language ? { language: String(payload.language).slice(0, 35) } : {}),
      ...(payload.timezone ? { timezone: String(payload.timezone).slice(0, 64) } : {}),
      userAgent,
      ip,
      countryHint,
    });

    res.status(204).end();
  } catch (err) {
    logger.error({ err }, "Error recording tracking event");
    // Always return 204 so tracking errors never impact client web performance
    res.status(204).end();
  }
}

router.post("/v1/collect", handleCollect);
router.post("/collect", handleCollect);

/**
 * Public client IP echo endpoint.
 * Accurately returns the visitor's public IP address and country to the browser tracker without CORS issues.
 */
async function handleIpEcho(req: Request, res: Response): Promise<void> {
  try {
    let clientIp = getClientIp(req);
    if (isLocalIp(clientIp)) {
      const liveWan = await resolveLiveWanPublicIp();
      if (liveWan) clientIp = liveWan;
    }
    const country =
      (typeof req.headers["cf-ipcountry"] === "string" ? req.headers["cf-ipcountry"].toUpperCase() : "") ||
      (typeof req.headers["x-vercel-ip-country"] === "string" ? req.headers["x-vercel-ip-country"].toUpperCase() : "") ||
      undefined;

    res.json({ ip: clientIp, country });
  } catch {
    res.json({ ip: cachedWanPublicIp || "127.0.0.1" });
  }
}

router.get("/v1/ip", handleIpEcho);
router.get("/ip", handleIpEcho);

/**
 * Admin endpoint: Fetch visitor analytics and breakdown stats
 */
router.get("/v1/admin/visitors/analytics", requireAdmin, async (req: Request, res: Response) => {
  try {
    const rawPeriod = req.query.period;
    const period: ReportPeriod = isReportPeriod(rawPeriod) ? rawPeriod : "7d";

    const container = getTrackingContainer();
    const analytics = await container.getDashboardAnalytics.execute(period);

    res.json(analytics);
  } catch (err: any) {
    logger.error({ err }, "Failed to load visitor analytics");
    res.status(500).json({ error: "Failed to load visitor analytics: " + (err.message || String(err)) });
  }
});

/**
 * Admin endpoint: Purge expired tracking events
 */
router.post("/v1/admin/visitors/purge", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const container = getTrackingContainer();
    const result = await container.purgeExpiredEvents.execute();
    res.json(result);
  } catch (err: any) {
    logger.error({ err }, "Failed to purge tracking events");
    res.status(500).json({ error: "Failed to purge tracking events: " + (err.message || String(err)) });
  }
});

/**
 * Admin endpoint: Permanently reset/clear all visitor tracking telemetry
 */
router.post("/v1/admin/visitors/reset", requireAdmin, async (_req: Request, res: Response) => {
  try {
    const container = getTrackingContainer();
    await container.resetAllEvents();
    logger.info("All visitor tracking statistics permanently reset by administrator");
    res.json({ ok: true, message: "All visitor statistics have been permanently reset from database." });
  } catch (err: any) {
    logger.error({ err }, "Failed to reset tracking events");
    res.status(500).json({ error: "Failed to reset tracking events: " + (err.message || String(err)) });
  }
});

export default router;
