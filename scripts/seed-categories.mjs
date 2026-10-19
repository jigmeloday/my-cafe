// Adds the starter categories (skips any that exist):  npm run seed:categories
import { config } from "dotenv";
import pg from "pg";
import { randomBytes } from "node:crypto";

config({ path: ".env.local", quiet: true });

const NAMES = ["Festival", "Food", "Cafés", "Fashion", "Phones", "Stays", "Wellness", "Events", "Kids", "Home", "Services"];
const slugify = (t) => t.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "category";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  let added = 0;
  for (const name of NAMES) {
    const { rowCount } = await client.query('select 1 from "Category" where lower(name) = lower($1)', [name]);
    if (rowCount) continue;
    await client.query('insert into "Category" (id, name, slug) values ($1, $2, $3)', [`c${randomBytes(11).toString("hex")}`, name, slugify(name)]);
    added++;
  }
  console.log(`Added ${added} categories (${NAMES.length - added} already existed).`);
} finally {
  await client.end();
}
