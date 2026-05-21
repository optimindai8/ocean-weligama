import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function check() {
  try {
    const res = await pool.query("SELECT * FROM services");
    console.log("SERVICES IN DATABASE:");
    console.log(JSON.stringify(res.rows, null, 2));
    
    const trans = await pool.query("SELECT * FROM service_translations");
    console.log("TRANSLATIONS:");
    console.log(JSON.stringify(trans.rows, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
