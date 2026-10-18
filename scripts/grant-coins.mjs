// Adds coins to a business owner's wallet, for testing:  npm run grant-coins -- owner@example.com 500
// Real purchases aren't connected yet. Run this yourself, on your own machine.
import { config } from "dotenv";
import pg from "pg";
import { randomBytes } from "node:crypto";

config({ path: ".env.local", quiet: true });

const email = process.argv[2]?.trim().toLowerCase();
const coins = Number(process.argv[3]);
if (!email || !Number.isInteger(coins) || coins <= 0) {
  console.error("Usage: npm run grant-coins -- owner@example.com 500");
  process.exit(1);
}
const id = () => `c${randomBytes(11).toString("hex")}`;

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  await client.query("begin");
  const { rows } = await client.query(
    'select b.id from "Business" b join "User" u on u.id = b."ownerId" where lower(u.email) = $1 order by b."createdAt" limit 1',
    [email]
  );
  if (!rows[0]) throw new Error(`No business found for ${email}. Save the business profile first.`);
  const businessId = rows[0].id;

  await client.query('insert into "Wallet" (id, "businessId", balance) values ($1, $2, 0) on conflict ("businessId") do nothing', [id(), businessId]);
  const { rows: wallet } = await client.query('update "Wallet" set balance = balance + $2 where "businessId" = $1 returning id, balance', [businessId, coins]);
  await client.query(
    'insert into "CoinTransaction" (id, "walletId", type, amount, "balanceAfter", description) values ($1, $2, \'PURCHASE\', $3, $4, $5)',
    [id(), wallet[0].id, coins, wallet[0].balance, "Added by operator"]
  );
  await client.query("commit");
  console.log(`Added ${coins} coins. ${email} now has ${wallet[0].balance}.`);
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
