import pg from "pg";
const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  // Fetch current home_settings
  const curRes = await client.query("SELECT value FROM site_settings WHERE key = 'home_settings';");
  let currentValue = {};
  if (curRes.rows.length > 0) {
    currentValue = curRes.rows[0].value || {};
  }

  const defaultExperiences = {
    badge: "The Ocean Air Experience",
    title: "Surf • Stay • Taste • Explore",
    description: "Experience barefoot luxury, pristine Indian Ocean waves, authentic flavors, and tailored island adventures.",
    cards: [
      {
        id: "surf",
        num: "01",
        title: "Surf",
        tagline: "Ride the waves",
        description: "Experience the thrill of Weligama's world-class breaks with ISA certified instructors.",
        img: "/images/service-surf.png",
        href: "/packages"
      },
      {
        id: "stay",
        num: "02",
        title: "Stay",
        tagline: "Chill by the ocean",
        description: "Barefoot coastal luxury meets heartfelt Sri Lankan warmth 100 steps from the sand.",
        img: "/images/service-stay.png",
        href: "/rooms"
      },
      {
        id: "taste",
        num: "03",
        title: "Taste",
        tagline: "Taste the island",
        description: "Authentic coastal spices, freshly caught seafood, and wholesome tropical breakfast.",
        img: "/images/service-taste.png",
        href: "/about"
      },
      {
        id: "explore",
        num: "04",
        title: "Explore",
        tagline: "Local traditions",
        description: "From tranquil secret coves and stilt fishermen to unforgettable blue whale watching.",
        img: "/images/service-explore.jpg",
        href: "/packages"
      }
    ]
  };

  const updatedValue = {
    ...currentValue,
    experiences: defaultExperiences
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value,
        updated_at = NOW();
  `, ['home_settings', JSON.stringify(updatedValue)]);

  console.log("Successfully seeded experiences settings in PostgreSQL site_settings!");
  await client.end();
}

main().catch((err) => {
  console.error("Error seeding experiences settings:", err);
  process.exit(1);
});
