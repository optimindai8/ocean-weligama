import pg from "pg";
const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  // Fetch current gallery_settings
  const curRes = await client.query("SELECT value FROM site_settings WHERE key = 'gallery_settings';");
  let currentValue = {};
  if (curRes.rows.length > 0) {
    currentValue = curRes.rows[0].value || {};
    console.log("Existing gallery_settings found:", Object.keys(currentValue));
  } else {
    console.log("No existing gallery_settings found, will insert new record.");
  }

  const defaultFeaturedMoments = {
    badge: "Curated Visual Stories",
    headingLead: "Featured",
    headingHighlight: "Moments",
    subtitle: "Curated highlights, ocean rhythms, and cinematic memories captured steps from Weligama Bay.",
    journalStatus: "Guest Journal Open",
    journalSubtext: "Be featured in our stories",
    shareCtaText: "Share Your Memory",
    videos: [
      {
        id: "f1",
        url: "/videos/148597-794221559_small.mp4",
        alt: "Ocean View",
        caption: "Ocean Vibes",
        badge: "Shoreline Soul",
        location: "Weligama Bay Waters",
        subtitle: "Golden hour shoreline strolls along Weligama's gentle, sun-warmed tides.",
        staggerClass: "md:-translate-y-5 lg:-translate-y-7",
        fromY: -60,
        type: "video"
      },
      {
        id: "f2",
        url: "/videos/123523-728292591_small.mp4",
        alt: "Serenity",
        caption: "Tropical Escape",
        badge: "Surf & Sunrise",
        location: "Main Surf Break",
        subtitle: "Gliding across glassy Indian Ocean breaks as the island awakens.",
        staggerClass: "md:translate-y-5 lg:translate-y-7",
        fromY: 60,
        type: "video"
      },
      {
        id: "f3",
        url: "/videos/vecteezy_majestic-green-sea-turtle-gliding-over-a-vibrant-coral-reef_71664992.mp4",
        alt: "Majestic Sea Turtle",
        caption: "Marine Life",
        badge: "Living Sanctuary",
        location: "Coral Reef Point",
        subtitle: "Gentle green sea turtles navigating vibrant tropical coral gardens.",
        staggerClass: "md:-translate-y-5 lg:-translate-y-7",
        fromY: -60,
        type: "video"
      }
    ]
  };

  const updatedValue = {
    ...currentValue,
    featuredMoments: {
      ...defaultFeaturedMoments,
      ...(currentValue.featuredMoments || {}),
    }
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ('gallery_settings', $1, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = $1, updated_at = NOW();
  `, [JSON.stringify(updatedValue)]);

  console.log("Successfully seeded gallery_settings in PostgreSQL site_settings!");
  await client.end();
}

main().catch((err) => {
  console.error("Error seeding gallery_settings:", err);
  process.exit(1);
});
