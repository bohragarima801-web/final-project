const { Client } = require('pg');

const bases = ["omguruji", "omgutuji", "omguruji1981", "omgutuji1981", "omgurutuji", "omgurutuji.1981"];
const suffixes = [".1981", "@1981", "1981", ".1981`"];

const variations = [];
for (const b of bases) {
  variations.push(b);
  variations.push(b.charAt(0).toUpperCase() + b.slice(1));
  variations.push(b.toUpperCase());
  
  for (const s of suffixes) {
    variations.push(b + s);
    variations.push(b.charAt(0).toUpperCase() + b.slice(1) + s);
    variations.push(b.toUpperCase() + s);
  }
}

// Add verbatim from user: omgutuji.1981` (with a backtick)
variations.push("omgutuji.1981`");
variations.push("omguruji.1981`");

// Clean duplicates
const uniqueVariations = [...new Set(variations)];

async function bruteForce() {
  console.log(`Starting diagnostic test with ${uniqueVariations.length} password variations...`);
  for (const p of uniqueVariations) {
    const connectionString = `postgresql://postgres.ehiqtlofblrddauixeuz:${encodeURIComponent(p)}@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true`;
    const client = new Client({ connectionString });
    try {
      await client.connect();
      console.log(`\n🎉 🎉 🎉 SUCCESS! FOUND CORRECT PASSWORD: "${p}"`);
      await client.end();
      return;
    } catch (err) {
      // Print progress dot
      process.stdout.write('.');
    }
  }
  console.log('\n❌ All password variations failed.');
}

bruteForce();
