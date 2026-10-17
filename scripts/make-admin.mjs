// Promotes an existing account to admin:  npm run make-admin -- someone@example.com
// The person must have signed up first (at /register). Run it yourself, on your own machine.
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run make-admin -- someone@example.com");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  const { rows } = await client.query(
    'update "User" set role = \'ADMIN\', "updatedAt" = now() where lower(email) = $1 returning email, name',
    [email]
  );
  if (rows.length === 0) {
    console.error(`No account found for ${email}. Sign up at /register first, then run this again.`);
    process.exitCode = 1;
  } else {
    console.log(`${rows[0].name} <${rows[0].email}> is now an admin. They may need to log in again.`);
  }
} finally {
  await client.end();
}
