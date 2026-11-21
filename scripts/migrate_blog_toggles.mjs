import pg from "pg";
const { Client } = pg;

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to PostgreSQL database.");

  // Add the 3 toggle columns if they don't already exist
  await client.query(`
    ALTER TABLE blogs 
    ADD COLUMN IF NOT EXISTS is_main_post BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false;
  `);
  console.log("Added columns is_main_post, is_latest, show_on_home (if not existed).");

  // Sync existing is_featured into is_main_post
  await client.query(`
    UPDATE blogs 
    SET is_main_post = true 
    WHERE is_featured = true;
  `);

  // Verify columns
  const colsRes = await client.query(`
    SELECT column_name, data_type, column_default 
    FROM information_schema.columns 
    WHERE table_name = 'blogs'
    ORDER BY ordinal_position;
  `);
  console.log("Current blogs table schema:");
  console.table(colsRes.rows);

  // Set nice default assignments so all 3 sections look great:
  // 1. "Our story" -> is_main_post = true, show_on_home = true
  // 2. Next 4 stories -> is_latest = true
  // 3. First 3 stories -> show_on_home = true
  const allBlogsRes = await client.query(`
    SELECT id, title, is_featured, is_main_post, is_latest, show_on_home 
    FROM blogs 
    WHERE deleted_at IS NULL 
    ORDER BY date DESC;
  `);

  const stories = allBlogsRes.rows;
  console.log(`Found ${stories.length} stories.`);

  // Let's ensure story 0 is main post
  if (stories.length > 0) {
    await client.query(`UPDATE blogs SET is_main_post = true WHERE id = $1`, [stories[0].id]);
    await client.query(`UPDATE blogs SET show_on_home = true WHERE id = $1`, [stories[0].id]);
  }
  // Stories 1, 2, 3, 4 -> set is_latest = true
  for (let i = 1; i <= Math.min(4, stories.length - 1); i++) {
    await client.query(`UPDATE blogs SET is_latest = true WHERE id = $1`, [stories[i].id]);
  }
  // Stories 1, 2 -> also set show_on_home = true (making 3 stories on home)
  for (let i = 1; i <= Math.min(2, stories.length - 1); i++) {
    await client.query(`UPDATE blogs SET show_on_home = true WHERE id = $1`, [stories[i].id]);
  }

  const updatedRes = await client.query(`
    SELECT id, title, is_main_post, is_latest, show_on_home 
    FROM blogs 
    WHERE deleted_at IS NULL 
    ORDER BY date DESC;
  `);
  console.log("Updated stories state:");
  console.table(updatedRes.rows);

  await client.end();
  console.log("Migration complete!");
}

runMigration().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
