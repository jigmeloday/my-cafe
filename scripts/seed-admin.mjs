// Creates (or promotes) an admin account:   npm run seed:admin
//
// It asks for an email and password when you run it, so no password is ever stored in the code.
// For automation you can set ADMIN_EMAIL, ADMIN_PASSWORD and (optionally) ADMIN_NAME instead.
// If the email already has an account, that account is made an admin and its password is NOT changed.
import { randomBytes } from "node:crypto";
import { createInterface } from "node:readline";

import { hashPassword } from "better-auth/crypto";
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const MIN_PASSWORD = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fail = (message) => {
  console.error(`\n✗ ${message}`);
  process.exit(1);
};

/** Asks a question. With `hidden`, what is typed is not shown. */
function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (text) => {
        if (text.startsWith(question)) process.stdout.write(question);
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function collect() {
  let email = process.env.ADMIN_EMAIL?.trim();
  let password = process.env.ADMIN_PASSWORD;

  if ((!email || !password) && !process.stdin.isTTY) {
    fail("Run this in a terminal, or set ADMIN_EMAIL and ADMIN_PASSWORD.");
  }
  email ||= await ask("Admin email: ");
  if (!password) {
    password = await ask(`Password (at least ${MIN_PASSWORD} characters): `, { hidden: true });
    if (password !== (await ask("Type the password again: ", { hidden: true }))) fail("The passwords don't match.");
  }
  return { email: email.toLowerCase(), password };
}

/** Only asked when a NEW account is created in a terminal. Otherwise it defaults to "Admin". */
async function askName() {
  const fromEnv = process.env.ADMIN_NAME?.trim();
  if (fromEnv) return fromEnv;
  if (!process.stdin.isTTY) return "Admin";
  return (await ask('Name (press Enter for "Admin"): ')) || "Admin";
}

const { email, password } = await collect();
if (!EMAIL_PATTERN.test(email)) fail("That doesn't look like an email address.");
if (password.length < MIN_PASSWORD) fail(`The password must be at least ${MIN_PASSWORD} characters.`);
if (!process.env.DATABASE_URL) fail("DATABASE_URL is missing. Check .env.local.");

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  await client.query("begin");

  const existing = await client.query('select id, role from "User" where lower(email) = $1', [email]);
  if (existing.rows.length > 0) {
    await client.query('update "User" set role = \'ADMIN\', status = \'ACTIVE\', "updatedAt" = now() where id = $1', [existing.rows[0].id]);
    await client.query("commit");
    console.log(`\n✓ ${email} already had an account. It is now an admin. Its password was not changed.`);
  } else {
    const name = await askName();
    const id = randomBytes(16).toString("hex");
    await client.query(
      'insert into "User" (id, email, name, "emailVerified", role, status, "updatedAt") values ($1, $2, $3, true, \'ADMIN\', \'ACTIVE\', now())',
      [id, email, name]
    );
    await client.query(
      'insert into "Account" (id, "accountId", "providerId", "userId", password, "updatedAt") values ($1, $2, \'credential\', $2, $3, now())',
      [randomBytes(16).toString("hex"), id, await hashPassword(password)]
    );
    await client.query("commit");
    console.log(`\n✓ Admin created: ${email}\n  Log in at /login. You'll land on the admin dashboard.`);
  }
} catch (error) {
  await client.query("rollback").catch(() => undefined);
  fail(`Couldn't save: ${error.message}`);
} finally {
  await client.end();
}
