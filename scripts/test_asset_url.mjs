import { normalizeAssetUrl } from "../artifacts/ocean-weligama/src/lib/assetUrl.ts";

const cases = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  "/images/https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
  "https:/images//images.unsplash.com/photo-1534528741775-53994a69daeb",
  "/service-stay.png",
  "service-stay.png",
  "/images/service-stay.png",
  "/images/images/service-stay.png",
  "/videos/hero-video.mp4",
  "hero-video.mp4",
  ""
];

for (const c of cases) {
  console.log(`[RAW]: ${c}\n  -> [NORMALIZED]: ${normalizeAssetUrl(c, "/fallback.png")}\n`);
}
