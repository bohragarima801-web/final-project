// lib/clean-env.ts
// This file is imported at the very top of prisma.ts to clean and set environment variables 
// before `@prisma/client` evaluates.

function cleanEnvironment() {
  console.log('[clean-env] Initializing database environment variables...');
  let url = process.env.DATABASE_URL || '';
  let directUrl = process.env.DIRECT_URL || '';

  // 1. Check if Cloud SQL parameters are present
  if (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME) {
    const host = process.env.SQL_HOST;
    const user = process.env.SQL_USER;
    const password = process.env.SQL_PASSWORD || '';
    const dbName = process.env.SQL_DB_NAME;
    url = `postgresql://${user}:${encodeURIComponent(password)}@localhost/${dbName}?host=${encodeURIComponent(host)}`;
    directUrl = url;
    console.log('[clean-env] Configured Cloud SQL connection string.');
  }

  // 2. Clean up if url contains 'DATABASE_URL=' (pasted full declaration)
  if (url.includes('DATABASE_URL=')) {
    const match = url.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    if (match && match[1]) {
      url = match[1];
    } else {
      url = url.split('DATABASE_URL=')[1].trim().replace(/['"]/g, '');
    }
    console.log('[clean-env] Cleaned up inline DATABASE_URL assignment.');
  }

  // 3. Clean up if directUrl contains 'DIRECT_URL=' or similar
  if (directUrl.includes('DIRECT_URL=')) {
    const match = directUrl.match(/DIRECT_URL=["']?([^"'\s]+)["']?/);
    if (match && match[1]) {
      directUrl = match[1];
    } else {
      directUrl = directUrl.split('DIRECT_URL=')[1].trim().replace(/['"]/g, '');
    }
  } else if (directUrl.includes('DATABASE_URL=')) {
    const match = directUrl.match(/DATABASE_URL=["']?([^"'\s]+)["']?/);
    if (match && match[1]) {
      directUrl = match[1];
    } else {
      directUrl = directUrl.split('DATABASE_URL=')[1].trim().replace(/['"]/g, '');
    }
  }

  if (!url) {
    console.error('[clean-env] ❌ Warning: DATABASE_URL is missing!');
  } else {
    if (!directUrl) {
      directUrl = url;
    }
    process.env.DATABASE_URL = url;
    process.env.DIRECT_URL = directUrl;
    console.log('[clean-env] ✅ DATABASE_URL and DIRECT_URL set successfully in process.env.');
  }
}

cleanEnvironment();
