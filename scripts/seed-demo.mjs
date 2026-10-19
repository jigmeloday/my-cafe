// Fills the database with demo content so every screen has something to show:  npm run seed:demo
// Remove it again with:                                                         npm run seed:demo -- --reset
//
// It creates fictional businesses with promotions and events, customers who follow and save them, wallets with
// coin history, and a month of views and clicks. Everything it creates is labelled "demo" (ids start with
// "demo-", emails end in @demo.kuzu.test), and only that is ever touched: real accounts are left alone.
// Running it again replaces the demo content with a fresh copy. Demo accounts all use the password below.
import { randomBytes } from "node:crypto";

import { hashPassword } from "better-auth/crypto";
import { config } from "dotenv";
import pg from "pg";

import { BUSINESSES, CATEGORIES, CUSTOMERS, DEMO_EMAIL_DOMAIN, DEMO_PASSWORD, SOURCE_WEIGHTS } from "./seed-demo.data.mjs";

config({ path: ".env.local", quiet: true });

const RESET_ONLY = process.argv.includes("--reset");
const INTERESTS = ["Food & drink", "Cafés", "Fashion", "Electronics", "Wellness", "Stays", "Music", "Culture", "Kids", "Sports", "Books", "Crafts"];
const DAY = 86_400_000;
const PUBLISH_FEE = 50;
const FEATURED_PER_DAY = 100;
const HISTORY_DAYS = 45;

if (process.env.NODE_ENV === "production" && !process.argv.includes("--force")) {
  console.error("Refusing to put demo data in a production environment. Pass --force if you really mean it.");
  process.exit(1);
}

// A small repeatable random number generator, so a re-run produces the same numbers.
function rng(seed) {
  let a = [...seed].reduce((h, c) => (Math.imul(h, 31) + c.charCodeAt(0)) | 0, 7);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const id = () => `c${randomBytes(11).toString("hex")}`;
const slugify = (t) => t.toLowerCase().normalize("NFKD").replace(/\p{M}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
// Today in Bhutan (UTC+6), as a date at midnight UTC: how this app stores dates.
const today = new Date(Math.floor((Date.now() + 6 * 3_600_000) / DAY) * DAY);
const dayFrom = (offset) => new Date(today.getTime() + offset * DAY);
const atTime = (date, hour) => new Date(date.getTime() - 6 * 3_600_000 + hour * 3_600_000);

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

/** Inserts many rows in a few statements. Dates are sent as UTC text so the result doesn't depend on this computer's time zone. `cols` are [name, optional SQL type to cast to]. */
async function insertMany(table, cols, rows, chunk = 2000) {
  for (let i = 0; i < rows.length; i += chunk) {
    const part = rows.slice(i, i + chunk);
    const params = [];
    const values = part.map((row) => `(${cols.map(([, cast], c) => { params.push(row[c] instanceof Date ? row[c].toISOString() : row[c]); return `$${params.length}${cast ? `::${cast}` : ""}`; }).join(", ")})`);
    await client.query(`insert into "${table}" (${cols.map(([n]) => `"${n}"`).join(", ")}) values ${values.join(", ")}`, params);
  }
}

async function removeDemo() {
  // Businesses first (their owners can't be deleted while they own one); promotions, wallets and events follow.
  await client.query(`delete from "Business" where "ownerId" like 'demo-%'`);
  await client.query(`delete from "User" where id like 'demo-%'`);
}

async function ensureCategories() {
  const slugs = {};
  for (const name of CATEGORIES) {
    const found = await client.query(`select id from "Category" where lower(name) = lower($1)`, [name]);
    if (found.rows[0]) slugs[name] = found.rows[0].id;
    else {
      const newId = id();
      await client.query(`insert into "Category" (id, name, slug) values ($1, $2, $3)`, [newId, name, slugify(name)]);
      slugs[name] = newId;
    }
  }
  return slugs;
}

async function main() {
  await client.connect();
  const host = new URL(process.env.DATABASE_URL).host;
  console.log(`Database: ${host}`);
  await client.query("begin");
  try {
    await removeDemo();
    if (RESET_ONLY) {
      await client.query("commit");
      console.log("Demo content removed.");
      return;
    }

    const categoryId = await ensureCategories();
    const passwordHash = await hashPassword(DEMO_PASSWORD);
    const random = rng("kuzu-demo");
    const pick = (list) => list[Math.floor(random() * list.length)];

    // People ----------------------------------------------------------------------------------------------
    const users = [];
    const accounts = [];
    const profiles = [];
    const addUser = (userId, name, role, createdAt) => {
      const email = `${userId}@${DEMO_EMAIL_DOMAIN}`;
      users.push([userId, email, name, true, role, "ACTIVE", createdAt, createdAt]);
      accounts.push([`acc-${userId}`, userId, "credential", userId, passwordHash, createdAt, createdAt]);
    };

    BUSINESSES.forEach((b, i) => addUser(`demo-owner-${i + 1}`, `${b.name} owner`, "BUSINESS_OWNER", dayFrom(-b.openedDaysAgo - 5)));
    CUSTOMERS.forEach(([name, dzongkhag], i) => {
      const userId = `demo-customer-${i + 1}`;
      addUser(userId, name, "USER", dayFrom(-Math.floor(random() * 200) - 10));
      const interests = INTERESTS.filter(() => random() < 0.3).slice(0, 4);
      const consent = random() < 0.65;
      profiles.push([userId, `${1985 + Math.floor(random() * 20)}-${String(1 + Math.floor(random() * 12)).padStart(2, "0")}-${String(1 + Math.floor(random() * 28)).padStart(2, "0")}`,
        random() < 0.5 ? "female" : "male", `+97517${200000 + Math.floor(random() * 99999)}`, pick(["email", "phone", "whatsapp"]), dzongkhag === "Thimphu" ? pick(["Motithang", "Babesa", "Changzamtog", "Norzin Lam"]) : dzongkhag, dzongkhag,
        interests, consent, consent ? dayFrom(-30) : null]);
    });

    await insertMany("User", [["id"], ["email"], ["name"], ["emailVerified"], ["role", `"Role"`], ["status", `"AccountStatus"`], ["createdAt"], ["updatedAt"]], users);
    await insertMany("Account", [["id"], ["accountId"], ["providerId"], ["userId"], ["password"], ["createdAt"], ["updatedAt"]], accounts);
    await insertMany("Profile", [["userId"], ["birthday", "date"], ["gender"], ["phone"], ["preferredContact"], ["town"], ["dzongkhag"], ["interests", "text[]"], ["marketingConsent"], ["marketingConsentAt"], ["updatedAt"]],
      profiles.map((p) => [...p, new Date()]));

    // Businesses, promotions, wallets -----------------------------------------------------------------------
    const businessRows = [];
    const promoRows = [];
    const promoMeta = []; // for events, favourites and notifications
    const walletRows = [];
    const featuredRows = [];
    const txRows = [];

    BUSINESSES.forEach((b, i) => {
      const businessId = `demo-biz-${b.key}`;
      const ownerId = `demo-owner-${i + 1}`;
      const opened = dayFrom(-b.openedDaysAgo);
      businessRows.push([businessId, ownerId, b.name, b.key, b.description, b.tagline, `owner${i + 1}@${DEMO_EMAIL_DOMAIN}`, b.phone, b.website, b.line1, b.town, b.dzongkhag,
        JSON.stringify(b.hours), b.services, b.products, b.status, opened, opened]);

      let live = 0;
      b.promotions.forEach(([title, type, status, discount, description, start, end, category, extra]) => {
        const slug = slugify(title);
        const promoId = `demo-promo-${b.key}-${slug}`.slice(0, 90);
        const created = dayFrom(Math.min(start, 0) - 1);
        promoRows.push([promoId, businessId, category ? categoryId[category] : null, slug, title, type, status, discount, description, b.town ? `${b.town}, ${b.dzongkhag}` : "",
          status === "DRAFT" ? null : dayFrom(start), status === "DRAFT" ? null : end === null ? null : dayFrom(end), created, created]);
        if (status !== "DRAFT") live++;
        promoMeta.push({ promoId, businessId, slug, title, status, start, end, popularity: extra.popularity ?? 3, owner: b.name, featured: extra.featured });
        if (extra.featured) {
          const [from, days] = extra.featured;
          featuredRows.push([id(), promoId, businessId, dayFrom(from), dayFrom(from + days - 1), days * FEATURED_PER_DAY, created]);
        }
      });

      // Coins: bought enough to cover every publish fee plus a cushion, then spent 50 per published promotion.
      const featuredCoins = promoMeta.filter((p) => p.businessId === businessId && p.featured).reduce((s, p) => s + p.featured[1] * FEATURED_PER_DAY, 0);
      const fees = live * PUBLISH_FEE + featuredCoins;
      const bought = Math.max(b.purchased, Math.ceil((fees + 150) / 100) * 100);
      const walletId = `demo-wallet-${b.key}`;
      const history = [{ type: "PURCHASE", amount: bought, description: `Bought ${bought.toLocaleString("en")} coins`, at: new Date(opened.getTime() + 3_600_000) }];
      promoMeta.filter((p) => p.businessId === businessId && p.status !== "DRAFT").forEach((p, n) =>
        history.push({ type: "PUBLISH", amount: -PUBLISH_FEE, description: `Published: ${p.title}`, at: new Date(opened.getTime() + (n + 2) * 3_600_000 + 86_400_000) }));
      promoMeta.filter((p) => p.businessId === businessId && p.featured).forEach((p, n) =>
        history.push({ type: "FEATURED", amount: -p.featured[1] * FEATURED_PER_DAY, description: `Featured on the home page: ${p.title} · ${p.featured[1]} ${p.featured[1] === 1 ? "day" : "days"}`, at: new Date(opened.getTime() + (n + 12) * 3_600_000 + 86_400_000) }));
      history.sort((x, y) => x.at - y.at);
      let balance = 0;
      history.forEach((h) => {
        balance += h.amount;
        txRows.push([id(), walletId, h.type, h.amount, balance, h.description, h.at]);
      });
      walletRows.push([walletId, businessId, balance]);
    });

    await insertMany("Business", [["id"], ["ownerId"], ["name"], ["slug"], ["description"], ["tagline"], ["email"], ["phone"], ["website"], ["addressLine1"], ["town"], ["dzongkhag"],
      ["hours", "jsonb"], ["services", "text[]"], ["products", "text[]"], ["status", `"BusinessStatus"`], ["createdAt"], ["updatedAt"]], businessRows);
    await insertMany("Promotion", [["id"], ["businessId"], ["categoryId"], ["slug"], ["title"], ["type", `"PromotionType"`], ["status", `"PromotionStatus"`], ["discount"], ["description"], ["location"],
      ["startsAt", "date"], ["endsAt", "date"], ["createdAt"], ["updatedAt"]], promoRows);
    await insertMany("Wallet", [["id"], ["businessId"], ["balance"]], walletRows);
    await insertMany("CoinTransaction", [["id"], ["walletId"], ["type", `"CoinTransactionType"`], ["amount"], ["balanceAfter"], ["description"], ["createdAt"]], txRows);

    await insertMany("FeaturedBooking", [["id"], ["promotionId"], ["businessId"], ["startsAt", "date"], ["endsAt", "date"], ["coins"], ["createdAt"]], featuredRows);

    // Views and clicks over the last month and a half. Busier on weekends, weighted by each promotion's popularity.
    const eventRows = [];
    const sourceTotal = SOURCE_WEIGHTS.reduce((s, [, w]) => s + w, 0);
    const pickSource = () => {
      let r = random() * sourceTotal;
      for (const [name, w] of SOURCE_WEIGHTS) if ((r -= w) < 0) return name;
      return "other";
    };
    for (const p of promoMeta.filter((m) => m.status !== "DRAFT")) {
      const firstDay = Math.max(-HISTORY_DAYS, p.start);
      const lastDay = p.status === "ENDED" ? (p.end ?? -1) : Math.min(0, p.end ?? 0);
      for (let d = firstDay; d <= lastDay; d++) {
        const weekday = dayFrom(d).getUTCDay();
        const views = Math.round(p.popularity * (2 + random() * 4) * (weekday === 0 || weekday === 6 ? 1.5 : 1) * (d === 0 ? 0.5 : 1));
        for (let v = 0; v < views; v++) {
          const when = atTime(dayFrom(d), 7 + Math.floor(random() * 15));
          eventRows.push([id(), p.promoId, "VIEW", pickSource(), new Date(when.getTime() + Math.floor(random() * 3_000_000))]);
          if (random() < 0.07) eventRows.push([id(), p.promoId, "CLICK", pickSource(), new Date(when.getTime() + 60_000 + Math.floor(random() * 3_000_000))]);
        }
      }
    }
    await insertMany("PromotionEvent", [["id"], ["promotionId"], ["type", `"PromotionEventType"`], ["source"], ["createdAt"]], eventRows, 4000);

    // Followers, saved promotions and notifications ------------------------------------------------------------
    const follows = [];
    const favorites = [];
    const notifications = [];
    const liveMeta = promoMeta.filter((m) => m.status === "PUBLISHED");
    CUSTOMERS.forEach((_, i) => {
      const userId = `demo-customer-${i + 1}`;
      const followed = [...BUSINESSES].sort(() => random() - 0.5).slice(0, 2 + Math.floor(random() * 4));
      followed.forEach((b) => follows.push([userId, `/businesses/${b.key}`, dayFrom(-Math.floor(random() * 28))]));
      [...liveMeta].sort(() => random() - 0.5).slice(0, 3 + Math.floor(random() * 4)).forEach((p) =>
        favorites.push([userId, `/promotions/${p.slug}`, dayFrom(-Math.floor(random() * 20))]));
      const fresh = pick(liveMeta);
      notifications.push([id(), userId, `New from ${fresh.owner}`, fresh.title, `/promotions/${fresh.slug}`, random() < 0.5 ? new Date() : null, dayFrom(-Math.floor(random() * 6))]);
      const event = pick(liveMeta.filter((p) => p.start > 0)) ?? fresh;
      notifications.push([id(), userId, "Happening soon", event.title, `/promotions/${event.slug}`, null, dayFrom(-Math.floor(random() * 3))]);
    });
    // A few reports so the admin Moderation queue has something to review.
    const reportRows = [];
    const reportOn = (title, reporters, reason, detail, status = "OPEN", decision = null, daysAgo = 1) => {
      const promo = promoMeta.find((p) => p.title === title);
      reporters.forEach((n, i) =>
        reportRows.push([id(), `demo-customer-${n}`, promo.promoId, reason, i === 0 ? detail : "", status, decision, status === "OPEN" ? null : "demo-admin", status === "OPEN" ? null : dayFrom(-daysAgo + 1), dayFrom(-daysAgo)]));
    };
    reportOn("Winter coats clearance", [1, 4, 7], "MISLEADING", "The sale ended last week but the page still shows 40% off.", "OPEN", null, 2);
    reportOn("Launch week: first visit 20% off", [2], "WRONG_PRICE", "Price at the spa was different.", "OPEN", null, 1);
    reportOn("Hiking boots & jackets", [3, 5], "SPAM", "Posted the same offer many times.", "RESOLVED", "DISMISSED", 6);
    await insertMany("Report", [["id"], ["reporterId"], ["promotionId"], ["reason", `"ReportReason"`], ["details"], ["status", `"ReportStatus"`], ["decision", `"ReportDecision"`], ["resolvedById"], ["resolvedAt"], ["createdAt"]], reportRows);

    await insertMany("Follow", [["userId"], ["href"], ["createdAt"]], follows);
    await insertMany("Favorite", [["userId"], ["href"], ["createdAt"]], favorites);
    await insertMany("Notification", [["id"], ["userId"], ["title"], ["description"], ["href"], ["readAt"], ["createdAt"]], notifications);

    await client.query("commit");
    console.log(`\n✓ Demo content created`);
    console.log(`  ${BUSINESSES.length} businesses · ${promoRows.length} promotions (${featuredRows.length} featured) · ${CUSTOMERS.length} customers`);
    console.log(`  ${eventRows.length.toLocaleString("en")} views/clicks · ${follows.length} follows · ${favorites.length} saved · ${notifications.length} notifications`);
    console.log(`\n  Log in as any demo account (password: ${DEMO_PASSWORD}):`);
    console.log(`    business owner  demo-owner-1@${DEMO_EMAIL_DOMAIN}   (Druk Pizzeria; owners 1 to ${BUSINESSES.length})`);
    console.log(`    customer        demo-customer-1@${DEMO_EMAIL_DOMAIN} (customers 1 to ${CUSTOMERS.length})`);
    console.log(`\n  Remove it all later with: npm run seed:demo -- --reset`);
  } catch (error) {
    await client.query("rollback").catch(() => {});
    throw error;
  }
}

main()
  .catch((error) => {
    console.error("\n✗", error.message);
    process.exitCode = 1;
  })
  .finally(() => client.end());
