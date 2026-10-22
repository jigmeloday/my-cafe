// Deletes old site-visit records and the one-way visitor codes next to old views and clicks. Totals are kept.
//   npm run purge:analytics              shows what would change (nothing is changed)
//   npm run purge:analytics -- --yes     does it
//   npm run purge:analytics -- --yes --days 60
// Keep the number of days in step with ANALYTICS_RETENTION_DAYS in lib/track-events.ts and the Privacy Policy.
// Run it on a schedule, for example once a day.
import { config } from "dotenv";
import pg from "pg";

config({ path: ".env.local", quiet: true });

const args = process.argv.slice(2);
const apply = args.includes("--yes");
const daysArg = args.indexOf("--days");
const days = daysArg >= 0 ? Number(args[daysArg + 1]) : 90;
if (!Number.isInteger(days) || days < 1) {
  console.error("--days must be a whole number of 1 or more.");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
const cutoff = `now() - interval '${days} days'`;

try {
  await client.connect();
  const count = async (sql) => Number((await client.query(sql)).rows[0].n);
  const visits = await count(`select count(*) as n from "SiteVisit" where "createdAt" < ${cutoff}`);
  const promotionCodes = await count(`select count(*) as n from "PromotionEvent" where "createdAt" < ${cutoff} and visitor <> ''`);
  const businessCodes = await count(`select count(*) as n from "BusinessEvent" where "createdAt" < ${cutoff} and visitor <> ''`);
  console.log(`Older than ${days} days: ${visits} site visits, ${promotionCodes} promotion and ${businessCodes} business records with a visitor code.`);

  if (!apply) {
    console.log("Nothing was changed. Run again with --yes to apply.");
  } else {
    await client.query("begin");
    await client.query(`delete from "SiteVisit" where "createdAt" < ${cutoff}`);
    await client.query(`update "PromotionEvent" set visitor = '' where "createdAt" < ${cutoff} and visitor <> ''`);
    await client.query(`update "BusinessEvent" set visitor = '' where "createdAt" < ${cutoff} and visitor <> ''`);
    await client.query("commit");
    console.log("Done. Site visits deleted and visitor codes cleared; view and click totals are kept.");
  }
} catch (error) {
  await client.query("rollback").catch(() => {});
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
