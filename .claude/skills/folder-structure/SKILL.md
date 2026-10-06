---
name: folder-structure
description: Target folder structure and file-placement rules for the ad/discovery marketplace (Next.js App Router, route groups, components, server actions, services, repositories, lib, Prisma). Use whenever creating, moving, or naming files, pages, components, actions, services, repositories, schemas, or types.
---

# Folder Structure

Companion to the `discovery-marketplace` skill. Follow this layout when adding any file. Create folders as they are needed — don't scaffold empty ones up front.

> The repo currently has `app/` at the root (no `src/`). The target layout below uses `src/`. When the first real files are added, move to `src/` (and update the `@/*` path alias in `tsconfig.json`) rather than creating a mix of both.

## Layering rule (where code goes)

```
page / component  →  server/actions (or route.ts)  →  services  →  server/repositories  →  Prisma
```
- `components/` and `app/**/page.tsx`: UI only. No business logic, no Prisma.
- `server/actions/*.actions.ts`: `"use server"` entry points. Auth/permission check → Zod parse → call a service → revalidate. Thin.
- `services/<domain>/*.service.ts`: business rules, orchestration, DB transactions (wallet/CPC, payments, click validation).
- `server/repositories/*.repository.ts`: the only layer that talks to Prisma for that entity. Plain data access, no business rules.
- `lib/`: cross-cutting helpers (db client, auth, permissions, constants, formatters, Zod schemas).

## Tree

```
ad-marketplace/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── public/
│   ├── images/
│   ├── icons/
│   └── fonts/
├── src/
│   ├── app/
│   │   ├── (public)/                 # no auth required
│   │   │   ├── page.tsx              # /
│   │   │   ├── layout.tsx
│   │   │   ├── discover/page.tsx
│   │   │   ├── deals/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── businesses/page.tsx
│   │   │   ├── businesses/[slug]/page.tsx
│   │   │   ├── categories/page.tsx
│   │   │   ├── categories/[slug]/page.tsx
│   │   │   ├── promotions/[slug]/page.tsx
│   │   │   └── search/page.tsx
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── account/                  # customer
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── saved/ offers/ following/ enquiries/
│   │   │   ├── bookings/ notifications/ settings/     # each: page.tsx
│   │   ├── business/                 # business dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   ├── promotions/page.tsx
│   │   │   ├── promotions/new/page.tsx
│   │   │   ├── promotions/[id]/page.tsx
│   │   │   ├── promotions/[id]/edit/page.tsx
│   │   │   ├── campaigns/page.tsx
│   │   │   ├── campaigns/new/page.tsx
│   │   │   ├── campaigns/[id]/page.tsx
│   │   │   ├── wallet/ transactions/ analytics/ leads/ settings/   # each: page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   └── dashboard/ businesses/ users/ promotions/ campaigns/
│   │   │       categories/ payments/ clicks/ moderation/ reports/   # each: page.tsx
│   │   ├── go/[campaignId]/route.ts           # tracked CPC redirect
│   │   ├── api/
│   │   │   ├── payments/webhook/route.ts
│   │   │   ├── uploads/route.ts
│   │   │   └── health/route.ts
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                       # shadcn primitives (button, card, input, dialog, table, tabs, form, ...)
│   │   ├── shared/                   # page-header, search-bar, filter-bar, empty-state, pagination,
│   │   │                             # status-badge, price-display, loading-state, image-upload
│   │   ├── public/                   # navbar, footer, hero, promotion-card/grid, business-card/grid,
│   │   │                             # event-card, category-card, featured-section
│   │   ├── account/                  # account-sidebar, saved-promotion-card, notification-item
│   │   ├── business/                 # sidebar, header, stat-card, promotion-form/table, campaign-form/table,
│   │   │                             # wallet-balance, transaction-table, analytics-card/chart, lead-table
│   │   └── admin/                    # sidebar, header, stat-card, business/user/promotion/campaign/payment-table
│   ├── server/
│   │   ├── actions/                  # auth, business, promotion, campaign, wallet, account, lead,
│   │   │                             # notification  → <name>.actions.ts
│   │   └── repositories/             # user, business, category, promotion, campaign, wallet,
│   │                                 # transaction, click, lead  → <name>.repository.ts
│   ├── services/
│   │   ├── auth/auth.service.ts
│   │   ├── business/business.service.ts
│   │   ├── promotion/promotion.service.ts
│   │   ├── campaign/campaign.service.ts
│   │   ├── wallet/wallet.service.ts
│   │   ├── payment/payment.service.ts
│   │   ├── click/click.service.ts
│   │   ├── click/click-validator.ts
│   │   ├── analytics/analytics.service.ts
│   │   ├── lead/lead.service.ts
│   │   ├── notification/notification.service.ts
│   │   └── email/
│   │       ├── email.service.ts  email.types.ts  email.config.ts  index.ts
│   │       ├── providers/        # nodemailer.provider.ts, ses.provider.ts
│   │       └── templates/        # verification, welcome, password-reset, campaign-created,
│   │                             # campaign-paused, promotion-approved/rejected,
│   │                             # wallet-recharged, low-balance  → <name>-email.tsx
│   ├── lib/
│   │   ├── db.ts  auth.ts  permissions.ts  constants.ts  utils.ts
│   │   ├── validations/          # auth, business, promotion, campaign, wallet, lead → <name>.schema.ts
│   │   └── formatters/           # currency.ts, date.ts, number.ts
│   ├── hooks/                    # use-debounce.ts, use-mobile.ts, use-pagination.ts
│   ├── types/                    # auth, user, business, promotion, campaign, wallet, analytics, lead
│   └── generated/prisma/         # Prisma client output (generated — never edit, gitignored)
├── .env  .env.example  .gitignore
├── components.json  eslint.config.mjs  next.config.ts
├── package.json  postcss.config.mjs  tsconfig.json  README.md
```

## Per-page colocated layout
Each page/feature keeps its own parts beside `page.tsx` (only `page`/`route`/`layout` files become routes, so extra folders are safe inside `app/`). Full rules are in `frontend-code-rules`.

```
home/                         # e.g. src/app/(public)/ or a feature route folder
├── page.tsx                  # thin — composes components only
├── components/               # feature-specific components, ≤150 lines each
│   └── form-component.tsx
├── constant/
│   └── home.constant.ts      # constants, static data, option lists
├── model/
│   └── home.type.ts          # types & interfaces
├── utils/
│   └── home.utils.ts         # pure helpers
└── hooks/
    └── use-home-filters.ts   # stateful logic (only if needed)
```
- Feature-specific code lives in the page's own `components/ constant/ model/ utils/ hooks/`; create only what's needed.
- Shared across features → promote: components → `src/components/shared` (or the area folder), hooks → `src/hooks`, helpers → `src/lib` / `src/utils`, shared constants → `src/lib/constants.ts`, shared types → `src/types`.
- Suffixes: `*.constant.ts`, `*.type.ts`, `*.utils.ts`, `use-*.ts`.
- This colocated layout applies to the pages in `(public)`, `account`, `business`, `admin`; the project-wide tree below shows where shared code goes.

## Naming and placement conventions
- Files and folders: `kebab-case`. Suffixes: `*.actions.ts`, `*.service.ts`, `*.repository.ts`, `*.schema.ts`.
- Route groups `(public)` and `(auth)` don't affect URLs. `account/`, `business/`, `admin/` are real URL segments with their own `layout.tsx` and role/permission guard.
- Page-specific components go in that page's `components/` folder; reused within an area → `components/<area>/`; reused across areas → `components/shared/`. `components/ui/` is shadcn-generated primitives only.
- Same-named files in `business/` and `admin/` (sidebar, stat-card, tables) are intentionally separate — don't merge them.
- One Zod schema per domain in `lib/validations/`, shared by forms (React Hook Form) and server actions.
- Money formatting only via `lib/formatters/currency.ts` (integer minor units in, string out).
- Wallet/CPC deduction, payment credit, and click validation live in `services/` and run inside a single DB transaction; the `/go/[campaignId]` route handler and webhook route stay thin and delegate to services.
- Emails: components in `templates/`, sending through `email.service.ts`; providers are swappable via `email.config.ts`.
- Prisma client is created once in `lib/db.ts`; import from there, never instantiate elsewhere.
- Leave out folders for later phases (leads, notifications, analytics, bookings) until their phase begins — see the build order in `discovery-marketplace`.
