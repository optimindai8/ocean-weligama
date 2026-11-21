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

  const defaultWhyChooseUs = {
    badge: "Why Choose Us",
    headingLead: "More Than Just A",
    headingHighlight: "Stay",
    description: "We believe your vacation should be effortless. From the moment you arrive, every detail is handled with warmth and precision, so you can focus entirely on unwinding by the ocean.",
    features: [
      {
        id: "location",
        icon: "MapPin",
        title: "Unbeatable Location",
        desc: "Literally 100 steps from Weligama’s gentle surf break. Wake up, grab your board, and you're in the water in seconds."
      },
      {
        id: "luxury",
        icon: "Palmtree",
        title: "Authentic Barefoot Luxury",
        desc: "We blend high-end modern comforts with authentic Sri Lankan hospitality for a genuinely unique island experience."
      },
      {
        id: "effortless",
        icon: "Waves",
        title: "Effortless Experience",
        desc: "From airport transfers to personalized surf lessons and daily fresh breakfasts, we curate your entire journey."
      }
    ],
    socialProof: {
      score: "5.0 / 5.0",
      text: "Loved by 1,000+ guests worldwide",
      avatars: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
      ],
      avatarBadge: "+1k"
    },
    showcase: {
      image: "/images/service-stay.png",
      awardTag: "Top Rated",
      awardTitle: "2026 Choice Award",
      awardIcon: "🏆",
      testimonialQuote: "The most peaceful week of my life. Waking up to the sound of waves and walking straight onto the sand is an unmatched experience.",
      testimonialAuthor: "Sarah Jenkins",
      testimonialAuthorRole: "Stayed 7 nights • Deluxe Ocean Suite",
      testimonialAuthorInitial: "S"
    }
  };

  const updatedValue = {
    ...currentValue,
    whyChooseUs: defaultWhyChooseUs
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value,
        updated_at = NOW();
  `, ['home_settings', JSON.stringify(updatedValue)]);

  console.log("Successfully seeded whyChooseUs settings in PostgreSQL site_settings!");
  await client.end();
}

main().catch((err) => {
  console.error("Error seeding whyChooseUs settings:", err);
  process.exit(1);
});
