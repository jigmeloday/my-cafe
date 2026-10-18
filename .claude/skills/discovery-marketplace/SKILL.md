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
- **Admin (R1):** `app/(admin)/admin/…`, using the same shared dashboard shell as business (`components/dashboard/`; menus name icons as strings in `NAV_ICONS`, because components can't be passed from server layouts to client menus). Built: Overview (sign-ups and coin-sales graphs, needs-attention list), Businesses (verify / suspend / reinstate), Users (suspend / reinstate; admins can't be suspended), Moderation (dismiss / warn / remove reported promotions). Not built yet: Promotions, Campaigns (email), Payments (coin purchases), Categories, Reports; Clicks is Release 2. Every admin action must check the caller is an admin and write an audit log entry. **Admin Users is live on the database** (`/admin/users`: server-side search (search-as-you-type via `hooks/use-live-search.ts`; several words in any order across name and email, plus phone numbers from the profile; rules in `lib/search.ts`), filter chips and 10-per-page pagination driven by the URL; row actions Suspend / Unsuspend / Delete in `server/actions/admin-user.actions.ts` → `services/admin/admin-user.service.ts` → `server/repositories/admin-user.repository.ts`). Rules: admins can't act on admins or themselves; suspending signs the person out everywhere; a user who owns a business can't be deleted; each change is written to the `AuditLog` table in the same transaction (the log copies names in, so it survives deletions; there is no page to view it yet). Admin Businesses, Moderation and Overview are still sample data. Reusable: `components/shared/pagination-bar.tsx`, `lib/pagination.ts`, `lib/search.ts` (`escapeLike`).
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
- Spending: `walletRepository.spend` (inside the caller's transaction; one conditional update, so it can never overspend). Publishing a promotion costs `COIN_COSTS.publish`; editing a live one is free.
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
- Rows: **Popular offers** (most clicks in 14 days, newest among ties; "Popular" badge only if clicked), **Just opened** (newest businesses), **Happening soon** (EVENT promotions, soonest first). Empty rows are hidden. The hero shows up to 4 of the same promotions (paid banners don't exist yet, so nothing is "Sponsored").
- All real cards link to `/promotions/<slug>`, whatever the type. `/promotions/[slug]` tries the database first, then the sample deals, so the old sample links still work.
- **Counting:** the detail page sends a VIEW (`TrackView`) and its main button sends a CLICK (`TrackedCta`) to `/api/track`, with the visitor's source taken from the page they came from (`lib/track-client.ts`).
- Still sample data: `/deals`, `/discover`, `/events`, search, and the sample businesses/events pages.

## Demo data

- `npm run seed:demo` fills the database with fictional demo content (9 businesses, ~30 promotions and events, 14 customers, wallets with coin history, a month and a half of views/clicks, follows, saves, notifications). Content lives in `scripts/seed-demo.data.mjs`, the loader in `scripts/seed-demo.mjs`. Dates are relative to today, so it always looks current.
- Everything it creates is labelled demo: user ids start with `demo-`, emails are `demo-owner-N@demo.kuzu.test` / `demo-customer-N@demo.kuzu.test`, all with the password `Demo-pass-123`. It only ever touches those rows. Running it again replaces them; `npm run seed:demo -- --reset` removes them. It refuses to run when `NODE_ENV=production` unless `--force` is passed.

## Banners (live on the database, separate from promotions)

- **Promotions and banners are separate.** A promotion only costs the publish fee (`COIN_COSTS.publish`). Banners have their own section: `/business/banners` (list with status, views, clicks) and `/business/banners/new` (image, headline, short text, where it leads, first day, 3/7/14 days). Email and top-rank extras don't exist (email is Release 2).
- **Paying:** a banner costs `days × COIN_COSTS.bannerPerDay` coins, taken from the wallet in the same transaction that saves it (`bannerRepository.create` → `walletRepository.spend`, type `BANNER`). Not enough coins means nothing is saved.
- **Rules:** start today or later (Bhutan date); the image must be a file this business uploaded (`kind: "banner"` on `/api/business/media`); a linked promotion must be the owner's own PUBLISHED one; otherwise the banner opens the business page.
- **Showing:** `discoveryService.landing()` puts running banners (start ≤ today ≤ end, business and owner not suspended) first in the home hero, marked Sponsored; promotions fill the rest. Banners can't be edited or refunded yet.
- **Counting:** `HeroSlide` sends a VIEW when half the banner is visible and a CLICK on its button, to `POST /api/track` with `{ bannerId, type }`; only a running banner counts (`BannerEvent`).
