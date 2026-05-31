const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.wyqosdwiazigzwtxvuxj:roxceq-zezrid-pytkY4@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres'
});

async function run() {
  await client.connect();
  const res = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`);
  console.log("Tables:", res.rows.map(r => r.table_name));
  
  try {
      const res2 = await client.query(`DELETE FROM services WHERE type = 'optional'`);
      console.log(`Deleted ${res2.rowCount} rows from services.`);
  } catch(e) {
      console.error(e.message);
  }
  
  await client.end();
}

run().catch(console.error);
