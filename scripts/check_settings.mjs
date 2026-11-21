import pg from "pg";
const { Client } = pg;

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  const res = await client.query("SELECT * FROM site_settings;");
  console.log("Existing site_settings rows:", res.rows);
  await client.end();
}

main().catch(console.error);
