const { Pool } = require('./lib/db/node_modules/pg');
const pool = new Pool({ connectionString: 'postgresql://postgres.wyqosdwiazigzwtxvuxj:roxceq-zezrid-pytkY4@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres' });
pool.query('SELECT email FROM users', (err, res) => {
  if (err) console.error(err);
  else console.log(res.rows);
  pool.end();
});
