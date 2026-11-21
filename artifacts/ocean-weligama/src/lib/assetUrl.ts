/**
 * Normalizes any asset URL (local images, videos, Supabase uploads, Unsplash external links)
 * to ensure bulletproof loading across all pages and environments.
 *
 * Automatically heals:
 * - Nested corrupted URLs like "/images/https://images.unsplash.com/..."
 * - Malformed protocols like "https:/images//images.unsplash.com/..."
 * - Double folder prefixes like "/images/images/foo.png" or "/videos/videos/bar.mp4"
 * - Root level un-prefixed assets like "/service-stay.png" -> "/images/service-stay.png"
 * - Bare un-slashed assets like "service-stay.png" -> "/images/service-stay.png"
 */
export function normalizeAssetUrl(rawUrl: string | null | undefined, defaultFallback = ""): string {
  if (!rawUrl || typeof rawUrl !== "string") return defaultFallback;
  let s = rawUrl.trim();
  if (!s) return defaultFallback;

  // Only normalize strings that are media assets or URLs. Leave plain text alone.
  const isMedia =
    /https?:\/\//i.test(s) ||
    /^(data:|blob:)/i.test(s) ||
    /^\/?(images|videos|icons|thumbnails)\//i.test(s) ||
    /\.(jpg|jpeg|png|webp|svg|gif|ico|avif|mp4|webm|mov|m4v|ogv)$/i.test(s);

  if (!isMedia) {
    return s;
  }

  // 1. Check if it contains an embedded http:// or https:// anywhere
  const httpMatch = s.match(/https?:\/\/[^\s"']+/i);
  if (httpMatch) {
    return httpMatch[0];
  }

  // 2. Check for malformed protocol like "https:/images//domain.com"
  const malformedHttp = s.match(/https?:\/(?:images|videos)?\/\/([^\s"']+)/i);
  if (malformedHttp) {
    return `https://${malformedHttp[1]}`;
  }

  // 3. Data or blob URLs
  if (/^(data:|blob:)/i.test(s)) return s;

  // 4. Remove any duplicate or repeated /images/ or /videos/
  s = s.replace(/^(\/?images\/)+/i, "/images/");
  s = s.replace(/^(\/?videos\/)+/i, "/videos/");

  // 5. Ensure leading slash if not present
  if (!s.startsWith("/")) {
    s = "/" + s;
  }

  // 6. If it's already a valid subfolder path
  if (/^\/(images|videos|icons|thumbnails)\//i.test(s)) {
    return s;
  }

  // 7. Route root level media files to their respective folders
  if (s.match(/^\/[^/]+\.(jpg|jpeg|png|webp|svg|gif|ico|avif)$/i)) {
    return `/images${s}`;
  }
  if (s.match(/^\/[^/]+\.(mp4|webm|mov|m4v|ogv)$/i)) {
    return `/videos${s}`;
  }

  return s;
}
