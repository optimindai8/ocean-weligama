import bcrypt from "bcryptjs";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const hash = await bcrypt.hash("OceanAdmin2025!", 10);

await pool.query(
  `INSERT INTO users (id, email, password_hash, role, full_name, is_active)
   VALUES (gen_random_uuid(), $1, $2, 'super_admin', 'Ocean Admin', true)
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  ["admin@oceanweligama.com", hash]
);

console.log("Admin user seeded: admin@oceanweligama.com / OceanAdmin2025!");
await pool.end();
