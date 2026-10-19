# Release 2: email campaigns (parked)

Email campaigns to followers are planned for **Release 2**. The UI built so far is parked here so it is
not lost. The leading underscore keeps this folder out of the routes, so nothing here is reachable in the
app, but it is still type-checked so it does not rot.

What is parked:

- `page.tsx`, `new/`, `[id]/`: the campaign list, the create form and the detail/edit pages.
- `analytics/`: the "Emails" tab of Analytics, and the "Recent campaigns" card of the dashboard.

To bring it back: move the folder to `campaigns/`, change its pages back to `PageProps<"/business/campaigns/[id]">`,
re-add the "Campaigns" item in `components/business/constant/business-nav.constant.ts`, the "Emails" tab in
`analytics/constant/analytics.constant.ts` and `analytics-explorer.tsx`, and the dashboard card and button.

Still live and shared: the sample email data and helpers in this folder's `constant/`, `model/` and `utils/`
are used by the dashboard and analytics numbers, and `lib/coins.ts` prices (`emailCost`) by the promotion form.
