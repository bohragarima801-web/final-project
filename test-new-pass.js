const { Client } = require('pg');

const passwords = ["omgutuji.1981", "omguruji.1981"];

async function testAll() {
  for (const p of passwords) {
    console.log(`Testing connection with: ${p}...`);
    const connectionString = `postgresql://postgres.ehiqtlofblrddauixeuz:${p}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log(`SUCCESS: Connected with password: ${p}`);
      await client.end();
      return;
    } catch (err) {
      console.error(`FAILED with: ${p} - ${err.message}`);
    }
  }
}

testAll();
