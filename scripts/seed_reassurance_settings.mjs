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

  const defaultReassurance = {
    card1: {
      stat: "Secure",
      title: "Booking",
      desc: "Instant Confirmation"
    },
    card2: {
      stat: "100",
      title: "Steps to Beach",
      desc: "Prime Surf Location"
    },
    card3: {
      stat: "4.9",
      suffix: "★",
      title: "Guest Rating",
      desc: "Top-Rated Hospitality"
    },
    card4: {
      stat: "Expert",
      title: "Surf Hub",
      desc: "ISA Certified Team"
    }
  };

  const updatedValue = {
    ...currentValue,
    reassurance: defaultReassurance
  };

  await client.query(`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (key) DO UPDATE
    SET value = EXCLUDED.value,
        updated_at = NOW();
  `, ['home_settings', JSON.stringify(updatedValue)]);

  console.log("Successfully seeded 'reassurance' into 'home_settings'!");

  const checkRes = await client.query("SELECT * FROM site_settings WHERE key = 'home_settings';");
  console.log("Updated home_settings row:", JSON.stringify(checkRes.rows[0].value, null, 2));

  await client.end();
}

main().catch(console.error);
