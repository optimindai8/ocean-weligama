import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const res = await pool.query("SELECT * FROM services");
    console.log("SERVICES IN DATABASE:", res.rows);
    
    const trans = await pool.query("SELECT * FROM service_translations");
    console.log("TRANSLATIONS:", trans.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
