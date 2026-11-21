/**
 * High-performance client-side video pre-warming and cache manager.
 * Preloads hero background videos so that page transitions have zero playback lag.
 */

// Track URLs that have already been preloaded or are currently preloading
const preloadedUrls = new Set<string>();

/**
 * Preloads a video into the browser's HTTP cache.
 * Can be called proactively on navbar hover or router mount.
 */
export function prefetchVideo(url: string | null | undefined): void {
  if (!url || typeof window === "undefined" || preloadedUrls.has(url)) return;
  preloadedUrls.add(url);

  try {
    // 1. Modern Link Preload in document head
    const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "video";
      link.href = url;
      link.type = "video/mp4";
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    }

    // 2. Headless video element to warm the decoder buffer
    const preloader = document.createElement("video");
    preloader.preload = "auto";
    preloader.muted = true;
    preloader.playsInline = true;
    preloader.src = url;
    preloader.load();
  } catch {
    // Silently ignore prefetch restrictions in restrictive environments
  }
}

/**
 * Common hero videos to preload during idle time.
 */
export const HERO_VIDEOS = [
  "/videos/hero-video.mp4",
  "/videos/about-hero-video.mp4",
  "/videos/rooms-hero-video.mp4",
  "/videos/package-hero-video.mp4",
  "/videos/gallery-hero-video.mp4",
  "/videos/blog-hero-video.mp4",
  "/videos/contact-page-video.mp4",
  "/videos/faq-hero-video.mp4",
];

/**
 * Automatically warms hero videos when the browser is idle.
 */
export function initVideoIdlePreload(): void {
  if (typeof window === "undefined") return;

  const runPreload = () => {
    // Preload the next likely hero videos with staggered timing
    HERO_VIDEOS.slice(0, 4).forEach((v, idx) => {
      setTimeout(() => prefetchVideo(v), 800 + idx * 600);
    });
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(runPreload, { timeout: 3000 });
  } else {
    setTimeout(runPreload, 1500);
  }
}
