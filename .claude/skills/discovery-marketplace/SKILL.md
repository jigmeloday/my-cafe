---
name: discovery-marketplace
description: Product spec and architecture rules for the advertising & discovery marketplace (Promotions, Campaigns, CPC clicks, prepaid Wallet, business dashboard, public discovery UI). Use when building or changing any feature in this app — models, routes, services, click tracking, wallet/money logic, or UI styling — to stay aligned with the product vision and MVP scope.
---

# Discovery Marketplace

> Don't build a website where people come to see ads. Build one where people come to discover things.

**DISCOVER → ADVERTISE → ENGAGE.** Two sides: people discovering businesses/deals/events, and businesses paying (CPC) to reach them. Public side feels like a discovery platform; business side feels like an ad/customer-acquisition platform.

Before writing Next.js code, read the relevant guide in `node_modules/next/dist/docs/` (see AGENTS.md) — this Next.js version has breaking changes.

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
