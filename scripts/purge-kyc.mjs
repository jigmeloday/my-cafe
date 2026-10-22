// Deletes ID and licence files and numbers once the retention period after a decision has passed.
//   npm run purge:kyc              shows what would be deleted (nothing is changed)
//   npm run purge:kyc -- --yes     deletes it
//   npm run purge:kyc -- --yes --days 14
// Keep the number of days in step with KYC_RETENTION_DAYS in lib/kyc.ts and the Privacy Policy.
// The decision itself (approved or sent back, who, when) stays. Run it on a schedule, for example once a day.
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

const bucket = process.env.STORAGE_BUCKET || "images";
const s3 = new S3Client({ region: process.env.AWS_REGION, endpoint: process.env.AWS_ENDPOINT_URL_S3, forcePathStyle: true });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

try {
  await client.connect();
  const { rows } = await client.query(
    `select id, "idDocKey", "licenseDocKey", "premisesKey" from "KycSubmission"
     where status <> 'PENDING' and "reviewedAt" < now() - ($1 || ' days')::interval and "idDocKey" <> ''`,
    [String(days)]
  );
  console.log(`${rows.length} decided request(s) older than ${days} days still hold documents.`);
  if (!apply) {
    console.log("Nothing was changed. Run again with --yes to delete them.");
  } else {
    let failed = 0;
    for (const row of rows) {
      const keys = [row.idDocKey, row.licenseDocKey, row.premisesKey].filter(Boolean);
      try {
        for (const key of keys) await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
      } catch (error) {
        // Keep the keys so the next run tries again; never forget a file we failed to delete.
        failed += 1;
        console.error(`Could not delete files for ${row.id}:`, error.message);
        continue;
      }
      await client.query(
        `update "KycSubmission" set "idDocKey" = '', "licenseDocKey" = '', "premisesKey" = '', "idNumber" = '', "licenseNumber" = '' where id = $1`,
        [row.id]
      );
    }
    console.log(`Deleted documents and numbers for ${rows.length - failed} request(s).${failed ? ` ${failed} failed and will be retried.` : ""}`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
