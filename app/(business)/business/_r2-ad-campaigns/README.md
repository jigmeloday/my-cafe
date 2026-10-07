# Release 2: paid ad campaigns (parked)

Pay-per-click (CPC) campaigns are planned for **Release 2**. The UI built so far is parked here
so it is not lost. The leading underscore keeps this folder out of the routes, so nothing here is
reachable in the app, but it is still type-checked so it does not rot.

What is parked:

- `campaigns/`: list, create/edit form with a budget estimate, and a campaign detail page.
- `dashboard/`: the original overview with spend, CTR, wallet, and a performance chart.

Related code that stays in the shared folders for Release 2:

- `lib/validations/campaign.schema.ts`, `server/actions/campaign.actions.ts`
- `lib/constants.ts`: `CAMPAIGN_STATUSES`, `MIN_CPC_MINOR`, `CAMPAIGN_DESTINATIONS`, `CAMPAIGN_SCHEDULES`
- `lib/formatters/currency.ts`: `parseMoney` / `minorToInput`
- `components/business/constant/status.constant.ts`: ad campaign statuses
- `components/shared/money-field.tsx`

Note: the Release 1 wallet (`/business/wallet`) is a **coin** wallet, so the parked dashboard's money
`WALLET` sample data and wallet card are separate from it.

To revive it in Release 2:

1. Move `campaigns/` and `dashboard/` back under `app/(business)/business/` (or merge them into the
   email campaigns and dashboard that exist by then), and fix the relative imports.
2. Build the payment webhook and the `/go/{campaignId}` click route first. Spending must run inside a
   single database transaction.
3. Decide how ad spend relates to the Release 1 **coin wallet** (`/business/wallet`): either charge clicks
   in coins, or add a separate money balance. The parked UI was written for a money wallet
   (integer minor units, `lib/formatters/currency.ts`), so it needs adapting if coins are used.
4. Re-add the "Boost" action to promotions.

Charts: the Release 1 Analytics page uses a general-purpose chart in `components/business/charts/`
(any metrics, takes plain data). The parked dashboard has its own older, ad-specific chart. When
reviving Release 2, switch it over to the shared one and delete the old copy.
