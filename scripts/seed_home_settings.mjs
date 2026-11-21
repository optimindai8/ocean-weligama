import pg from "pg";
const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  const defaultHomeSettings = {
    hero: {
      ratingScore: 4.9,
      ratingLabel: "Rating",
      guestsCount: 1000,
      guestsSuffix: "+",
      guestsLabel: "Happy Guests",
      taglineHighlight: "100 steps from the ocean.",
      taglineText: "Barefoot beach living meets Sri Lankan hospitality."
    }
  };

  // Upsert the default home_settings into site_settings
  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value,
        updated_at = NOW();
  `, ['home_settings', JSON.stringify(defaultHomeSettings)]);

  console.log("Successfully seeded 'home_settings' into site_settings table.");

  const res = await client.query("SELECT * FROM site_settings WHERE key = 'home_settings';");
  console.log("Current row:", res.rows[0]);

  await client.end();
}

main().catch(console.error);
