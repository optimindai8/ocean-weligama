const pg = require('../lib/db/node_modules/pg');
const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres.wyqosdwiazigzwtxvuxj:roxceq-zezrid-pytkY4@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres' });

async function check() {
  try {
    const res = await pool.query('SELECT id, slug, category, type, base_price FROM services');
    console.log('Services in database:', res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

check();
