// Removes the names and phone numbers people shared when they reserved a seat, once their event is long over.
// The registration itself stays (so "40 people came" still counts), but who they were does not.
//   npm run purge:registrations              shows what would change (nothing is changed)
//   npm run purge:registrations -- --yes     does it
//   npm run purge:registrations -- --yes --days 14
// Keep the number of days in step with REGISTRATION_RETENTION_DAYS in lib/constants.ts and the Privacy Policy.
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

// An event's last day: its own last day (a one-day event has only a first day), or for older events the listing's.
// Days are Bhutan days (UTC+6). An event with no end day at all is never purged.
const lastDay = `case when p."eventStartsAt" is not null then coalesce(p."eventEndsAt", p."eventStartsAt") else p."endsAt" end`;
const where = `r."promotionId" = p.id and (r.name <> '' or r.phone <> '') and ${lastDay} < ((now() + interval '6 hours')::date - ${days})`;

try {
  await client.connect();
  const { rows } = await client.query(`select count(*) as n, count(distinct p.id) as events from "EventRegistration" r, "Promotion" p where ${where}`);
  console.log(`Events that ended more than ${days} days ago: ${rows[0].n} registrations (${rows[0].events} events) still hold a name or phone.`);

  if (!apply) {
    console.log("Nothing was changed. Run again with --yes to apply.");
  } else {
    const result = await client.query(`update "EventRegistration" r set name = '', phone = '' from "Promotion" p where ${where}`);
    console.log(`Done. Names and phone numbers removed from ${result.rowCount} registrations; the registrations themselves are kept for the totals.`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
