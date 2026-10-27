// Removes the name, phone number and note customers shared when they ordered, once the order is long finished
// (completed or cancelled). The order itself stays (so "12 orders" and the totals still count), but who made it does not.
//   npm run purge:orders              shows what would change (nothing is changed)
//   npm run purge:orders -- --yes     does it
//   npm run purge:orders -- --yes --days 14
// Keep the number of days in step with ORDER_RETENTION_DAYS in lib/constants.ts and the Privacy Policy.
// Run it on a schedule, for example once a day.
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const args = process.argv.slice(2);
const apply = args.includes("--yes");
const daysArg = args.indexOf("--days");
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 30;
if (!Number.isInteger(days) || days < 1) {
  console.error("--days must be a whole number of 1 or more.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

// "Finished" is the last time the order changed: it is not touched again once completed or cancelled.
const where = `status in ('COMPLETED', 'CANCELLED') and (name <> '' or phone <> '' or note <> '') and "updatedAt" < now() - interval '${days} days'`;

try {
  await client.connect();
  const { rows } = await client.query(`select count(*) as n from "ProductOrder" where ${where}`);
  console.log(`Orders finished more than ${days} days ago: ${rows[0].n} still hold a name, phone or note.`);

  if (!apply) {
    console.log("Nothing was changed. Run again with --yes to apply.");
  } else {
    const result = await client.query(`update "ProductOrder" set name = '', phone = '', note = '' where ${where}`);
    console.log(`Done. Personal details removed from ${result.rowCount} orders; the orders themselves are kept for the totals.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
