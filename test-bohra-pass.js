const { Client } = require('pg');

const p = "Bohra.1981**";

async function check() {
  // Try Pooler
  try {
    console.log('Testing Pooler (6543)...');
    const c1 = new Client({ connectionString: `postgresql://postgres.ehiqtlofblrddauixeuz:${encodeURIComponent(p)}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true` });
    await c1.connect();
    console.log('SUCCESS: Pooler (6543) connected!');
    await c1.end();
    return;
  } catch (e) {
    console.log('Pooler failed:', e.message);
  }

  // Try Direct
  try {
    console.log('Testing Direct (5432)...');
    const c2 = new Client({ connectionString: `postgresql://postgres.ehiqtlofblrddauixeuz:${encodeURIComponent(p)}@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres` });
    await c2.connect();
    console.log('SUCCESS: Direct (5432) connected!');
    await c2.end();
    return;
  } catch (e) {
    console.log('Direct failed:', e.message);
  }
}

check();
