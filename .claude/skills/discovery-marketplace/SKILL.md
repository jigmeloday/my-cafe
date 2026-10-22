---
name: discovery-marketplace
description: Product spec and architecture rules for the advertising & discovery marketplace (Promotions, Campaigns, CPC clicks, prepaid Wallet, business dashboard, public discovery UI). Use when building or changing any feature in this app — models, routes, services, click tracking, wallet/money logic, or UI styling — to stay aligned with the product vision and MVP scope.
---

# Discovery Marketplace

> Don't build a website where people come to see ads. Build one where people come to discover things.

**DISCOVER → ADVERTISE → ENGAGE.** Two sides: people discovering businesses/deals/events, and businesses paying (CPC) to reach them. Public side feels like a discovery platform; business side feels like an ad/customer-acquisition platform.

Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (see AGENTS.md) — this Next.js version has breaking changes.

## Release scope (decided)
- **Release 1 (now):** discovery, business profiles, promotions, accounts, **email campaigns**, and a **coin wallet**. No pay-per-click ads.
- **Coin wallet (R1):** businesses buy **coins** (whole numbers, never fractions) in packs and spend them on visibility: emailing followers about a promotion (per follower), a homepage banner (per day) and ranking at the top (per day). Prices are sample values in `lib/coins.ts`. Coins can be bought in packs or as a **custom amount** (50 to 100,000); both use the same per-coin price tiers (`coinPriceMinor`), and the price must never go down as the amount goes up. Pages: `/business/wallet`, `/business/transactions`. Costs show on the promotion form and the email campaign form. Buying and spending are UI-only until payments/billing exist; coin purchases must be credited from the payment webhook and every change recorded as a wallet transaction.
- **Release 2:** **email campaigns** (parked in `app/(business)/business/_r2-email-campaigns/`, see its README) and paid **CPC ad campaigns** (money per click), `/go/{campaignId}` click tracking, Boost on promotions, spend analytics. Parked, unrouted, in `app/(business)/business/_r2-ad-campaigns/` (see its README). The "Campaign / CPC" sections below describe Release 2.
- "Campaign" in the Release 1 dashboard means an **email campaign**. Only people who allowed emails (email channel + "places I follow" topic + promotional consent) may be emailed.
- **Analytics (R1):** `/business/analytics` has a date range (7/14/30 days) and tabs: **Overview** (views, clicks, click-through rate, saves, chart, clicks by source, funnel, coins spent), **Posts** (clicks per post bar chart, per-post trend, clicks by type, table), **Banners** (impressions, clicks, CTR, coins per click, runs), **Emails** (open/click rate per campaign, funnel, table) and **Audience** (followers by place, interests, who can be emailed). Sample data is built from one daily series and split with exact whole-number maths (`apportion`), so every tab adds up; banner clicks only exist on days a banner ran. Real numbers need view/click events recorded when people open and click a promotion (a tracked redirect). Shared charts (line, bar, funnel, breakdown list) live in `components/business/charts/`.
- **Admin (R1):** `app/(admin)/admin/…`, using the same shared dashboard shell as business (`components/dashboard/`; menus name icons as strings in `NAV_ICONS`, because components can't be passed from server layouts to client menus). Built: Overview (sign-ups and coin-sales graphs, needs-attention list), Businesses (verify / suspend / reinstate), Users (suspend / reinstate; admins can't be suspended), Moderation (dismiss / warn / remove reported promotions). Not built yet: Promotions, Campaigns (email), Payments (coin purchases), Categories, Reports; Clicks is Release 2. Every admin action must check the caller is an admin and write an audit log entry. **Admin Users is live on the database** (`/admin/users`: server-side search (search-as-you-type via `hooks/use-live-search.ts`; several words in any order across name and email, plus phone numbers from the profile; rules in `lib/search.ts`), filter chips and 10-per-page pagination driven by the URL; row actions Suspend / Unsuspend / Delete in `server/actions/admin-user.actions.ts` → `services/admin/admin-user.service.ts` → `server/repositories/admin-user.repository.ts`). Rules: admins can't act on admins or themselves; suspending signs the person out everywhere; a user who owns a business can't be deleted; each change is written to the `AuditLog` table in the same transaction (the log copies names in, so it survives deletions; there is no page to view it yet). Admin Businesses is still sample data (Moderation and Overview are live, see below). Reusable: `components/shared/pagination-bar.tsx`, `lib/pagination.ts`, `lib/search.ts` (`escapeLike`).
- **Database + auth (live):** Neon Postgres via Prisma 7 (`lib/db.ts`, schema in `prisma/schema.prisma`, migrations in `prisma/migrations/`); Better Auth email/password (`lib/auth.ts`, `lib/session.ts`, `proxy.ts`, `/api/auth/*`). Roles `USER`, `BUSINESS_OWNER`, `ADMIN`: nobody can choose ADMIN at sign-up; create one with `npm run seed:admin` (asks for email and password, never stores one in code) or promote an existing account with `npm run make-admin -- email`. The **customer profile is bound to the database** (`Profile` table; repository → service → actions: `server/repositories/profile.repository.ts`, `services/profile/`, `server/actions/account.actions.ts`). Promotional consent stores the date it was given. Favorites, following and notifications on the profile, and everything in business/admin, still use sample data. Dev tip: after changing the Prisma schema, run `prisma generate` and restart `next dev` (the old client is cached).
- Not built yet: the banner creator (image + headline for the homepage banner) and the real top-rank ordering.

## Core rule
Before building anything ask: **does this improve discovery, advertising, or engagement?** If not, it is not MVP. Don't let future features (CPL/CPM/CPA, retargeting, reviews, fraud ML) complicate the MVP.

## Not this product
Generic directory, social clone, classifieds, banner-ad site, forced-product marketplace, CRM, SMS/email marketing. Optimize for useful discovery, not ad volume.

## Domain rules (non-negotiable)
- **One `Promotion` model with a `type`**: DEAL, SALE, EVENT, PRODUCT, SERVICE, GIVEAWAY, ANNOUNCEMENT. "Summer Sale" is a record, never a model.
- **Promotion ≠ Campaign.** Promotion = what is offered (title, type, description, discount, dates, location, category, images, CTA). Campaign = how it is paid-distributed (promotion, targeting, CPC, daily/total budget, dates, destination URL, status). One promotion → many campaigns. Never merge them.
- **Organic vs paid**: publishing a promotion is not an ad. Keep this distinction in architecture and UI (label paid placements clearly).
- **Two account types** chosen at sign-up: `USER` (customer) and `BUSINESS_OWNER` (`ACCOUNT_TYPES` in `lib/constants.ts`). Business owners later create their business in the dashboard.
- Browsing needs no account. Auth only for saving, following, claiming, enquiries, bookings, reviews, notifications.
- **Money = integer minor units** (`$10.50 → 1050`), never floats. Handle currencies with differing minor-unit exponents.
- **Wallet balance ≠ campaign budget.** Wallet is the source of funds; campaign budget caps one campaign's spend.
- Campaign states: `DRAFT, SCHEDULED, ACTIVE, PAUSED, COMPLETED, CANCELLED`. Auto-stop when: budget exhausted, wallet insufficient, end date reached, business pauses, admin disables.
- Avoid denormalized counters (review counts, star averages) without a proven perf need.

## Click tracking — `GET /go/{campaignId}`
Find campaign → check status → check dates → check campaign budget → check wallet → validate click → record `Click` → deduct CPC **atomically** → create `WalletTransaction` → redirect.
- Single DB transaction; prevent double charging, negative wallet, overspend, races (conditional/atomic updates or row locks, not read-then-write).
- `Click`: `id, campaignId, sessionId, ipHash, userAgent, referrer, amountChargedMinor, isValid, createdAt`. Hash IPs.
- Simple heuristics only at first. Repeated clicks are **not** automatically fraud (shared networks, carriers).
- Always redirect the user even if the click is not charged (invalid/exhausted) — don't break the user's journey.

## Payments
Provider → webhook → verify payment → credit wallet → create WalletTransaction. Webhooks must be idempotent.

## Architecture
Next.js App Router, TypeScript, Tailwind v4, shadcn/ui, React Hook Form + Zod, Prisma + PostgreSQL, Better Auth or Auth.js. Redis/jobs only when genuinely needed.

```
Component → Server Action / Route Handler → Service → Repository → Prisma → PostgreSQL
```
No business logic in React components. Validate input with Zod at the action/handler boundary. Wallet/CPC logic lives in services and runs inside a DB transaction.

## Models
Start: `User, Business, Category, Promotion`. Then: `Campaign, Wallet, WalletTransaction, Click`.
Later: `BusinessReview, Impression, CampaignAnalytics, Payment, Lead, FraudEvent, Follow, SavedPromotion, OfferClaim, Notification`.

## Routes
- Public: `/`, `/discover`, `/deals`, `/events`, `/categories`, `/businesses`, `/businesses/[slug]`, `/promotions/[slug]`, `/search`
- Customer: `/account`, `/account/{saved,offers,following,enquiries,bookings,notifications}`
- Business: `/business`, `/business/{dashboard,profile,promotions,campaigns,wallet,analytics,leads}`
- Admin: `/admin/{dashboard,businesses,promotions,campaigns,payments,clicks,users,categories,moderation,reports}`

## MVP loop (prove this first)
Business: create business → create promotion → add $100 to wallet → create CPC campaign → launch.
Customer: discover promotion → click "View Offer" → server records click → business charged $0.50 → redirected.
Dashboard: `Clicks: 1 · Spent: $0.50 · Remaining: $49.50`.

### Build order
1. Marketplace foundation: Business, Category, Promotion, discovery, search, promotion detail, business profile
2. Business dashboard: profile + promotion CRUD
3. Advertising: Campaign, CPC, budget, click tracking, states
4. Money: Wallet, deposits, payment integration + webhook, transactions, atomic CPC deduction
5. Analytics: impressions, clicks, spend, CTR, CPC
6. Customer features: accounts, saved, following, claims, notifications
7. Leads (CPL) · 8. Advanced advertising (CPM, CPA, targeting, fraud detection)

Don't skip ahead of the current phase.

## Design: Maroon + Cream + White
| Token | Hex |
|---|---|
| Primary Maroon | `#7F1D3A` |
| Dark Maroon | `#5F142B` |
| Soft Maroon | `#F5E8EC` |
| Background | `#FFFFFF` (was cream `#FAF7F2`) |
| Surface | `#FFFFFF` |
| Text | `#211A1C` |
| Muted text | `#756B6E` |
| Border | `#E8DFDA` |
| Accent Gold | `#D9A441` |
| Success | `#3F7D58` |

- Maroon = primary brand/action color only; don't make every section maroon. White page background; cream/grey (`muted` neutral grey #F2F2F2) for subtle panels. Gold sparingly. Charcoal text.
- Subtle, modern, visual, editorial; imagery provides variety. No heavy gradients, no dark-SaaS look, no corporate-directory look.
- Business dashboard may be more functional and data-dense.

## Voice
Public: useful, curious, modern, local, visual, trustworthy — lead with "Discover what's happening", not "Advertise your business". Business side: simple, measurable, professional, practical, transparent. Avoid "revolutionize your business" copy, marketing jargon, and ad-network terminology.

## Email verification

- Login requires a verified email. Sign-up and an unverified login both send the user to `/verify-email` (resend, 60s cooldown); the link lands on `/verified`.
- Email goes out through Resend (`services/email`). Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`. The `onboarding@resend.dev` sender only delivers to the Resend account owner; verify a domain at resend.com/domains for real recipients.
- In development, with no key or when Resend refuses, the email and its link print in the server console. In production a failure throws.
- `npm run verify-email -- someone@example.com` marks an account verified by hand.

## Wallet (live on the database)

- `/business/wallet` and `/business/transactions` read the real wallet (`services/wallet/wallet.service.ts` → `server/repositories/wallet.repository.ts`). Balance and history are whole coins; every change to a balance has a `CoinTransaction` row written in the same database transaction.
- Spending: `walletRepository.spend` (inside the caller's transaction; one conditional update, so it can never overspend). A promotion costs `COIN_COSTS.publishPerDay` coins for every day from its start to its end date (`lib/listing.ts`), paid when it goes live; the end date is required to publish (max 90 days). Editing a live one is free, except moving the end date later, which charges only the extra days.
- Adding coins: an admin can add coins at `/admin/wallets` (audited), and `walletService.creditPurchase(businessId, coins, reference)` is what a payment webhook will call. `reference` is unique, so a repeated webhook credits once.
- **Payment gateway not connected.** `services/payment/payment.provider.ts` defines `PaymentProvider` and `getPaymentProvider()` (returns null). `buyCoinsAction` validates, then says payments aren't connected. To connect one: implement the interface, return it from `getPaymentProvider()`, add its webhook route calling `creditPurchase`.
- Scripts: `npm run grant-coins -- owner@example.com 500` (testing only).

## Business overview and analytics (live on the database)

- `/business/dashboard` and `/business/analytics` read real data through `services/analytics/analytics.service.ts` → `server/repositories/analytics.repository.ts`. Days are **Bhutan days (UTC+6)**, counted by the database.
- **Views and clicks** are rows in `PromotionEvent` (type VIEW or CLICK, plus a `source` such as discover/deals/events/search). They are recorded by `POST /api/track` `{ promotionId, type, source }`: only live promotions, never for the business's own owner. **Nothing calls it yet**, because the public promotion/event/deal pages still show sample data. When those pages are bound, call it on page view (VIEW) and on the offer button (CLICK).
- **Saves** are not events: they are `Favorite` rows whose address ends in the promotion's slug, so they always match the heart button.
- **Followers** are `Follow` rows with `href = /businesses/<slug>`. The audience tab only counts what followers saved on their profile (dzongkhag, interests, email consent), never names or emails.
- The Banners tab is removed (banners aren't built); email campaigns are Release 2.

## Access and security rules

- **One table decides who sees what:** `lib/access.ts` (`decide(role, area)`), applied by `guardArea()` in layouts. Admin area: admins only (everyone else signed in gets a **404**, signed out goes to login). Business area: business owners only. Customer profile: customers and admins. Public site: everyone **except business owners**, who stay in their dashboard (they preview their own page at `/business/preview`). Log in / sign up pages send signed-in people to their own home.
- **Layouts are not enough.** Every page under admin/business/profile also calls `requireRole(...)` itself, and every server action starts with a role check (`denyUnless(...)` in `server/actions/guard.ts`, or `getCurrentUser()`). Anyone can call a server action directly, so never rely on a button being hidden.
- **Brute-force limits:** `services/auth/rate-limit.service.ts` (table `RateLimitHit`): 5 wrong passwords per account and 30 per address per 15 minutes, 10 sign-ups and 10 resend requests per address per hour. Better Auth's own limiter doesn't cover calls made from server actions, which is why this exists.
- Security headers are set in `next.config.ts`; `/playground` is a 404 in production; cookies are HttpOnly, SameSite=Lax, and Secure in production.

## Landing page and promotion pages (live on the database)

- The home page (`app/(public)/page.tsx`) and `/promotions/[slug]` read real promotions through `services/discovery/discovery.service.ts` → `server/repositories/discovery.repository.ts`. A promotion is **visible** when it is PUBLISHED, hasn't ended (an end date lasts through that day, Bhutan time) and its business and owner aren't suspended. Not-yet-started promotions are hidden from lists but open by direct link.
- Rows: **Popular offers** (most clicks in 14 days, newest among ties; "Popular" badge only if clicked), **Just opened** (newest businesses), **Happening soon** (EVENT promotions, soonest first). Empty rows are hidden. The hero is for paid banners only (see Banners).
- All real cards link to `/promotions/<slug>`, whatever the type. `/promotions/[slug]` tries the database first, then the sample deals, so the old sample links still work.
- **Counting:** the detail page sends a VIEW (`TrackView`) and its main button sends a CLICK (`TrackedCta`) to `/api/track`, with the visitor's source taken from the page they came from (`lib/track-client.ts`).
- Still sample data: `/deals`, `/discover`, `/events`, search, and the sample businesses/events pages.

## Demo data

- `npm run seed:demo` fills the database with fictional demo content (9 businesses, ~30 promotions and events, 14 customers, wallets with coin history, a month and a half of views/clicks, follows, saves, notifications). Content lives in `scripts/seed-demo.data.mjs`, the loader in `scripts/seed-demo.mjs`. Dates are relative to today, so it always looks current.
- Everything it creates is labelled demo: user ids start with `demo-`, emails are `demo-owner-N@demo.nook.test` / `demo-customer-N@demo.nook.test`, all with the password `Demo-pass-123`. It only ever touches those rows. Running it again replaces them; `npm run seed:demo -- --reset` removes them. It refuses to run when `NODE_ENV=production` unless `--force` is passed.

## Banners (live on the database, separate from promotions)

- **Promotions and banners are separate.** A promotion costs `COIN_COSTS.publishPerDay` per day it runs (see `lib/listing.ts`). Banners have their own section: `/business/banners` (list with status, views, clicks) and `/business/banners/new` (image, headline, short text, first day, 3/7/14 days; it always opens the business page). Email and top-rank extras don't exist (email is Release 2).
- **Paying:** a banner costs `days × COIN_COSTS.bannerPerDay` coins, taken from the wallet in the same transaction that saves it (`bannerRepository.create` → `walletRepository.spend`, type `BANNER`). Not enough coins means nothing is saved.
- **Rules:** start today or later (Bhutan date); the image must be a file this business uploaded (`kind: "banner"` on `/api/business/media`); a banner never links to a promotion: it always opens the business page (older banners may still point at one).
- **Showing:** `discoveryService.landing()` puts running banners (start ≤ today ≤ end, business and owner not suspended) in the home hero, marked Sponsored, and nothing else: promotions never appear there, and with no banner running the hero is left out. Banners are never refunded. The owner can edit a scheduled or running banner at `/business/banners/<id>/edit`: picture, headline and text are free, and days can be added at the end (paid, only the new days; at most `MAX_BANNER_DAYS` = 30 in total); start and paid dates can't move, and ended or removed banners can't be edited. Every edit is written to the audit log (`banner.edit`, naming what changed), and a replaced picture is deleted.
- **Counting:** `HeroSlide` sends a VIEW when half the banner is visible and a CLICK on its button, to `POST /api/track` with `{ bannerId, type }`; only a running banner counts (`BannerEvent`).

## Featuring a promotion (paid, limited places)

- A promotion can be **featured** in the home page's "Featured" row: pick 1, 3 or 7 days and a first day in the promotion form (up to 45 days ahead). It costs `COIN_COSTS.featuredPerDay` (100) coins a day, **on top of** the publish fee, and is bought when publishing or later on an already-live promotion. Banners are a separate product (`/business/banners`).
- **Scarcity:** only `FEATURED_SLOTS_PER_DAY` (12) promotions can be featured on any one day (`lib/featured.ts`). A day with every place taken is sold out; a run containing one is refused and the days are named. Rules and pure helpers live in `lib/featured.ts`; the booking is `FeaturedBooking`.
- **No double-booking:** `featuredRepository.book` takes a database advisory lock, checks capacity and the promotion's own overlap, saves the booking and charges the wallet (`FEATURED`) inside the same transaction as the promotion save. If anything fails (full, not enough coins), nothing is saved or charged. The form's availability numbers are only a guide.
- **Showing:** `discoveryService.landing().featured` is every live promotion with a booking covering today, shuffled, at most `FEATURED_ROW_SIZE` (6), so everyone featured that day rotates through equally. Needs the promotion to be PUBLISHED and not ended. No refunds or edits of a booking yet.

## Deals, Events and New places (live on the database)

- `/deals`, `/events` and `/discover` (New places) read the database through `discoveryService.deals() / events() / newPlaces()`. The pages keep their filter chips: each item is given tags from real data by the pure rules in `lib/discovery-tags.ts` (ends today / this week from the end date, Buy 1 get 1 and % off from the discount text, topics from the category and words, "this weekend" from the start date, "opened this week/month" from when the business joined, place type from the category most of its promotions use). Filtering happens in the browser over up to 120 items; move to URL-driven server filtering and pagination when there are more.
- Events (`type EVENT`) have their own pages under `/events/<slug>` (facts: Date, Venue, Entry, Area; related are other events). Everything else is under `/promotions/<slug>`. Opening one under the other's path redirects. Cards, the home page and banners all link with the right path (`href(slug, type)` in the discovery service).
- Old sample links (sample deals and events pages) still open as a fallback.

## Reporting ads and moderation (live on the database)

- **Reporting:** a signed-in customer (or admin) can report a live promotion or event (Report button on its page) or a running sponsored banner ("Report ad" in the banner card), choosing a reason (`lib/report-reasons.ts`) and an optional note. Signed-out visitors are sent to log in; business owners can't report. One report per person per ad (database unique), 10 reports per hour per person (`services/report/report.service.ts`). Drafts, ended, removed and not-running ads can't be reported. `/report` explains how.
- **Admin queue:** `/admin/moderation` shows one card per ad (promotion or banner) with every open report grouped: count, most common reason, latest note. Decisions (`resolveReportAction`, admin only): **Dismiss**, **Warn business** (owner gets a notice, ad stays up) or **Remove ad** (promotion: `removedAt` set and status ENDED; banner: `removedAt` set; no coin refund). Every decision resolves all open reports for that ad in one transaction with the audit log (`report.dismiss|warn|remove`), and two admins acting at once can't both succeed.
- **Removed ads** disappear from the whole public site (`livePromotionWhere` and `bannerRepository.active` exclude `removedAt`), stop counting views and clicks, and the owner can't edit or republish a removed promotion; the owner's list shows "Removed by Nook".
- **Owner notices:** warnings and removals are `Notification` rows for the owner, shown on the business Overview as "Messages from Nook" for 30 days. The admin overview's "Open reports" count is real; the rest of the admin overview is still sample data.

## Admin overview (live on the database)

- `/admin/dashboard` reads `adminOverviewService.get()` → `server/repositories/admin-overview.repository.ts`. Daily counts are **Bhutan days (UTC+6)**, counted by the database, for 60 days (the last 30 and the 30 before for "vs previous period"). Admin accounts aren't counted as users.
- Cards: new users, new businesses (30 days, with totals), live promotions (what visitors can see, plus banners running now), coins spent (30 days). Charts: sign-ups, and coin activity (coins added to wallets vs coins spent). "Needs attention": businesses with status PENDING, open reports, suspended businesses, suspended users.
- **No revenue figure yet:** payments aren't connected, so there are no real coin sales. "Coins added" includes coins an admin added by hand. Add a revenue card when `creditPurchase` (payment webhook) is live: sum `CoinTransaction` rows with a `reference`.

## Business verification (KYC)

- **Owner:** `/business/verification` (sidebar "Verification"). A business sends its owner's name, 11-digit ID (CID) number, trade licence number, an ID document, a licence document and an optional shop photo (JPG, PNG, WebP or PDF, up to 5 MB), plus a consent tick. One waiting request at a time; after a rejection (reason shown) they can send again; once verified the page says so and the public business page shows the **Verified** badge. Nothing is blocked by being unverified yet (a later rule could require it for banners or featuring).
- **Admin:** `/admin/verification` (queue, oldest first, "Show all requests") and `/admin/verification/<id>` (details, documents, **Approve and verify** or **Send back with a reason**, reason of at least 10 characters). Approving sets the business to VERIFIED (never lifts a suspension), notifies the owner (shown as a message on their Overview) and writes the audit log. The admin overview counts waiting requests.
- **Documents are private.** Stored under `kyc/<businessId>/` in the bucket, never under `business/`, so the public `/api/media` route can't serve them. Upload: `POST /api/business/kyc` (business owners only, real file type read from the first bytes, 5 MB, 20 uploads an hour). Only key comes back. Viewing: `GET /api/admin/kyc/<key>` is **admin only** (everyone else, including the owner, gets 404), serves only files that belong to a real request, and writes a `kyc.view` audit entry for every opening. Those responses get stricter headers than the rest of the site (`documentHeaders` in `next.config.ts`: sandbox CSP, no referrer, never cached). Audit lines name the business only, never ID details; ID details are never returned by any public or owner-profile service.
- Rules and pure helpers: `lib/kyc.ts`, `lib/validations/kyc.schema.ts`; logic in `services/kyc/kyc.service.ts`; data in `server/repositories/kyc.repository.ts`.

## Global search

- The header search (What / Where / When) now submits to `/search`. `searchService.search` returns live deals, events and places. Every word typed must match (any order and case) across title, description, offer, category and business name; **Where** matches town, area, address or the promotion's location; **When** (Any time, Today, This weekend, This week) keeps things whose dates overlap that range (`lib/search-when.ts`); undated offers always stay. `%` and `_` are searched literally (`escapeLike`), at most 5 words and a 50-character place.
- Same visibility as the rest of the public site: no drafts, ended, removed or not-yet-started offers (events excepted), nothing from suspended businesses. The header boxes show what was searched. Business owners are redirected to their dashboard like every public page.
- Not built yet: as-you-type suggestions in the header, ranking by relevance (results are newest first), and paging beyond 24 per group.

## Terms, Privacy, About and Careers pages

- `/terms`, `/privacy`, `/about` and `/careers` live in the `(legal)` route group (`app/(legal)/`), whose layout has **no role guard**, so business owners can read them (they are kept out of the rest of the public site). The Terms and Privacy pages are plain data (`constant/terms.constant.ts`, `constant/privacy.constant.ts`) rendered by `components/legal/legal-page.tsx`; their numbers (publish fee, banner and featured prices, places per day) come from `lib/coins.ts` and `lib/featured.ts`, so they can't drift from the app. **Keep the wording true to the app**: when you change what data is stored, who can see it, prices or moderation rules, update these pages and `LEGAL.updated` in `lib/legal.ts`.
- **To fill in before launch:** `lib/legal.ts` holds the company name, address and contact email (placeholders in brackets today, shown on all four pages). The Terms and Privacy text is a careful draft, not legal advice: have a lawyer in Bhutan review it.
- `/about` shows real live totals (businesses, live deals, events coming up, verified) from `discoveryService.siteStats()`, hidden until there is at least one business.
- `/careers` lists the roles in `OPEN_ROLES` (`app/(legal)/careers/constant/careers.constant.ts`, with an example in the comment); when it is empty the page says there are no open roles and invites people to write, rather than showing fake jobs. Apply buttons are `mailto:` links once `LEGAL.contactEmail` is a real address.

## Support pages

- `/help` (Help centre) and `/contact` are in the `(legal)` group too (readable by business owners). `/report` explains how to report an ad. All three are linked from the footer's Support column.
- The FAQ is plain data in `app/(legal)/help/constant/help.constant.ts` (topics, then questions and answers). Prices and limits in answers come from `lib/coins.ts` and `lib/featured.ts`. The search box filters in the browser; answers stay in the page while collapsed (`keepMounted` + `hiddenUntilFound`) so search engines and Ctrl+F can find them.
- **Keep answers true to the app.** Password reset by email now works (the Help answer describes it). Buying coins online still isn't available (an admin adds coins): update that answer when it is built.
- `/contact` has a **form** (name, email, topic, message up to 2,000 characters; logged-in people are pre-filled). Messages are saved (`ContactMessage`: no IP stored) and, once `LEGAL.contactEmail` is a real address, emailed to the team with Reply-To set to the sender. Spam defences (it is open to everyone): a hidden bot-trap box (`hpCheck`; filled means a bot, told "thanks" and nothing saved), 5 messages an hour per address and 3 a day per email (`LIMITS.contactPerIp / contactPerEmail`). Admins read and answer them at `/admin/messages` (reply by email, Mark as done; text is always shown as plain text) and the admin overview counts waiting ones. Topics live in `lib/contact.ts`.

## Admin businesses and "Explore by area" (live on the database)

- **Admin Businesses** (`/admin/businesses`) reads the database like Users: URL-driven search as you type (business name, owner name or email, town or area; several words in any order), filter chips with counts (All, Needs review, Verified, Suspended) and 10 per page. Columns: business and owner, area, live promotions (published, not removed), followers (follows of `/businesses/<slug>`), verification state (not sent, waiting, sent back, approved) and status. Code: `services/admin/admin-business.service.ts` → `server/repositories/admin-business.repository.ts`.
- **Actions** (`server/actions/admin.actions.ts`, admin only, every change in one transaction with its audit entry `business.suspend|reinstate|verify` and, for suspend/reinstate/verify, a message to the owner): **Suspend** needs a written reason (10 to 300 characters) that the owner sees, hides the business and everything it posted from the whole public site (landing, detail pages, search, lists), and blocks the owner from publishing, editing promotions and creating banners; **Reinstate** brings it back as VERIFIED if it had an approved verification, otherwise as PENDING; **Verify without documents** (PENDING only, with a confirm) is for businesses the team already knows; the normal route is the Verification queue, which the menu links to when a request is waiting. Two admins acting at once can't both succeed.
- **Explore by area** (home page) is built from where businesses actually are: `discoveryService.areas()` groups visible businesses by dzongkhag and town (ignoring case and stray spaces), busiest first (up to 6 tabs and 12 towns each), and describes each town as "2 places · Food, Cafés" (its top categories by live promotions). Each town links to `/search?where=<town>`. Businesses without a town or dzongkhag are left out; the section is hidden when there are none. Pure rules: `groupAreas` in the discovery service.

## Everything bound (except the parked items)

- **No sample data is left in live pages.** Customer **Saved**, **Following**, **Recommended** and **This weekend** (Overview) resolve from the database through `discoveryService.savedCards / followedPlaces / recommended / weekendEvents` (an ended saved offer stays listed with an "Ended" label; removed offers and suspended businesses disappear; interests map to categories via `INTEREST_CATEGORIES`). The old sample fallbacks on `/promotions/<x>`, `/events/<x>` and `/businesses/<x>` and the sample data files are deleted: an unknown address is a 404.
- **Forgot / reset password works.** `/forgot-password` → emailed link (`passwordResetEmail`, works once for 60 minutes, same answer whether or not the address has an account; 3 an hour per email, 8 per address) → `/reset-password?token=…` (invalid or expired links get a "This link isn't valid" page) → new password signs the person out everywhere (`revokeSessionsOnPasswordReset`) and emails them a "password changed" notice. Login shows "Your password was changed" afterwards. Code: `lib/auth.ts` (`sendResetPassword`, `onPasswordReset`), `services/auth/password-reset.service.ts`, `server/actions/auth.actions.ts`.
- **Browse by category:** `/categories` (all with live counts) and `/categories/<slug>` (deals, events, places) from the admin-managed categories; a "Browse by category" row on the home page. Slugs drop accents ("Cafés" is `cafes`, `lib/slug.ts`).
- Empty photo spots show a quiet grey block with a picture icon (never "[Photo]" text); detail pages only show a gallery when there are photos.
- **Still left on purpose:** buying coins online (payment seam in `services/payment`), business email campaigns and ad campaigns (parked in `_r2-*`), Google sign-in (stub), the developer-only `/playground`.

## SEO

- **Helpers** live in `lib/seo/`: `site.ts` (`SEO`, `siteUrl()`, `absoluteUrl()`, `clip()`), `metadata.ts` (`pageMetadata()` gives title, description, canonical and share card; `NO_INDEX` for private areas), `schema.ts` (schema.org builders) and `detail.ts`. `components/seo/` has `JsonLd` and `DetailJsonLd`.
- **Every public page** sets its metadata with `pageMetadata({ title, description, path })`. Titles already end in " — Nook", so there is no title template: don't add one.
- **Private areas** (admin, business, users, auth layouts) export `NO_INDEX`. `/search` is `noindex, follow`. A not-found detail page also returns `NO_INDEX`.
- **Structured data:** home has WebSite (with search box) and Organization; deals are an Offer, events an Event, businesses a LocalBusiness; detail pages also carry a BreadcrumbList. The facts come from `DetailData.seo` and `BusinessProfile.seo`.
- **`app/robots.ts`, `app/sitemap.ts`** (live promotions, visible businesses and categories, built per request), `app/manifest.ts`, `app/opengraph-image.tsx` (default share card). `robots` uses `/business/` and `/business$` so public `/businesses/…` stays open, and allows `/api/media/` so images can be read.
- **Production needs `NEXT_PUBLIC_SITE_URL`** set to the real address, or canonical links, the sitemap and share cards use the local one.

## Performance

- **Run the code next to the database.** `vercel.json` sets `regions: ["sin1"]` (Singapore), where the Neon database is. Without it Vercel runs functions in the US and every query pays a trip across the world. If the database ever moves, move this too.
- **Each query is a network trip.** Measured from Bhutan, one query is about 140 ms whatever it asks, so the number of queries run one after another matters most. Ask for everything at once (`Promise.all`) and load related rows in the same query with `relationLoadStrategy: "join"` (generator preview feature `relationJoins`). Home went from about 1.1 s to 0.16 s this way.
- **See what a page asks.** Start the server with `DB_TIMING=1` to print each query and how long it took (`lib/db.ts`).
- **One session lookup per request.** `getCurrentUser` is wrapped in React `cache`, so a layout, its page and components share one lookup.
- **Pictures are stored small.** `/api/business/media` runs every business picture through `lib/image-optimize.ts` (upright, scaled down to the width it is shown at, saved as WebP at quality 82), and `/api/media` is cached by the CDN (`s-maxage`). Pictures uploaded before this stay as they were.
- **Neon sleeps when idle.** The first request after a quiet spell waits for the database to wake (seconds). Turning off scale-to-zero removes that, at the cost of an always-on compute.
