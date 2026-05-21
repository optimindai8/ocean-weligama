import { db } from "../lib/db/src/index";
import { gallery } from "../lib/db/src/schema/gallery";

const STATIC_COLLECTION = [
  { url: "/gallery-beach-surfers.jpg", altText: "Surfers at Weligama Beach", category: "beach" as const, status: "approved" as const, mediaType: "image" as const },
  { url: "/gallery-beach-boat.jpg", altText: "Traditional Boat on Shore", category: "property" as const, status: "approved" as const, mediaType: "image" as const },
  { url: "/gallery-beach-sunset-pink.jpg", altText: "Vibrant Pink Sunset", category: "beach" as const, status: "approved" as const, mediaType: "image" as const },
  { url: "/gallery-beach-palm-sunset.jpg", altText: "Palm Tree Silhouette at Sunset", category: "property" as const, status: "approved" as const, mediaType: "image" as const },
  { url: "/gallery-room-luxury.jpg", altText: "Luxury Boutique Room", category: "rooms" as const, status: "approved" as const, mediaType: "image" as const },
];

async function seed() {
  console.log("Seeding static gallery images to database...");
  for (const item of STATIC_COLLECTION) {
    await db.insert(gallery).values({
      url: item.url,
      altText: item.altText,
      category: item.category,
      status: item.status,
      mediaType: item.mediaType,
      sortOrder: 0,
    });
  }
  console.log("Done!");
  process.exit(0);
}

seed().catch(console.error);
