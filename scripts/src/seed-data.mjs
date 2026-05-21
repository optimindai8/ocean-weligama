import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  console.log("🌱 Starting seed...");

  try {
    // 1. Clear existing data (optional, but good for fresh start)
    // await pool.query("TRUNCATE rooms, services, gallery, room_translations, service_translations CASCADE");

    // 2. Insert Rooms
    console.log("🏠 Seeding rooms...");
    const roomResults = await pool.query(`
      INSERT INTO rooms (slug, type, max_guests, bedrooms, bathrooms, base_price_per_night, hero_image_url, is_featured)
      VALUES 
        ('deluxe-ocean-view', 'room', 2, 1, 1, 120.00, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=1000', true),
        ('private-beach-villa', 'villa', 6, 3, 2, 350.00, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000', true),
        ('sunset-suite', 'suite', 2, 1, 1, 180.00, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000', false)
      RETURNING id, slug
    `);

    const roomMap = Object.fromEntries(roomResults.rows.map(r => [r.slug, r.id]));

    // 3. Insert Room Translations
    console.log("📝 Seeding room translations...");
    await pool.query(`
      INSERT INTO room_translations (room_id, locale, name, description, short_desc)
      VALUES 
        ($1, 'en', 'Deluxe Ocean View', 'Wake up to the sound of waves in our premium oceanfront room.', 'Oceanfront luxury for two.'),
        ($2, 'en', 'Private Beach Villa', 'A spacious three-bedroom villa with direct beach access and private garden.', 'The ultimate group getaway.'),
        ($3, 'en', 'Sunset Suite', 'Enjoy breathtaking sunsets from your private balcony in this elegant suite.', 'Romantic and refined.')
    `, [roomMap['deluxe-ocean-view'], roomMap['private-beach-villa'], roomMap['sunset-suite']]);

    // 4. Insert Services
    console.log("🏄 Seeding services...");
    const serviceResults = await pool.query(`
      INSERT INTO services (slug, icon_emoji, category, base_price, unit)
      VALUES 
        ('surf-lessons', '🏄', 'activities', 45.00, 'per_session'),
        ('whale-watching', '🐋', 'tours', 60.00, 'per_person'),
        ('yoga-retreat', '🧘', 'wellness', 20.00, 'per_session')
      RETURNING id, slug
    `);

    const serviceMap = Object.fromEntries(serviceResults.rows.map(s => [s.slug, s.id]));

    // 5. Insert Service Translations
    console.log("📝 Seeding service translations...");
    await pool.query(`
      INSERT INTO service_translations (service_id, locale, name, description, short_desc)
      VALUES 
        ($1, 'en', 'Surf Lessons', 'Professional coaching for all levels at Weligama''s best breaks.', 'Catch your first wave.'),
        ($2, 'en', 'Whale Watching', 'A guided boat tour to see the majestic blue whales in Mirissa.', 'Unforgettable marine life.'),
        ($3, 'en', 'Morning Yoga', 'Daily sunrise yoga sessions on our rooftop deck.', 'Mindful mornings.')
    `, [serviceMap['surf-lessons'], serviceMap['whale-watching'], serviceMap['yoga-retreat']]);

    // 6. Insert Gallery Items
    console.log("🖼️ Seeding gallery...");
    await pool.query(`
      INSERT INTO gallery (url, category, caption, is_featured)
      VALUES 
        ('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800', 'beach', 'Sunset over Weligama Bay', true),
        ('https://images.unsplash.com/photo-1512100356956-c128783910c7?auto=format&fit=crop&q=80&w=800', 'food', 'Fresh local breakfast', false),
        ('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800', 'activities', 'Surf lesson in action', true)
    `);

    console.log("✅ Seed complete!");
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await pool.end();
  }
}

seed();
