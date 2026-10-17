// Marks an account's email as verified:  npm run verify-email -- someone@example.com
// For development, when the verification email can't be delivered. Run it yourself, on your own machine.
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: npm run verify-email -- someone@example.com");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  const { rows } = await client.query(
    'update "User" set "emailVerified" = true, "updatedAt" = now() where lower(email) = $1 returning email, name',
    [email]
  );
  if (rows.length === 0) {
    console.error(`No account found for ${email}.`);
    process.exitCode = 1;
  } else {
    console.log(`${rows[0].name} <${rows[0].email}> is now verified and can log in.`);
  }
} finally {
  await client.end();
}
