import type { ChartMetric } from "@/components/business/charts/model/chart.type";

export const PERIOD_DAYS = 30;

/** Platform-wide totals (sample). The lists on the other admin pages show a small sample. */
export const PLATFORM_TOTALS = {
  users: 1284,
  businesses: 212,
  livePromotions: 486,
};

export const SIGNUP_METRICS: ChartMetric[] = [
  { id: "users", label: "New users", kind: "number" },
  { id: "businesses", label: "New businesses", kind: "number" },
];

export const REVENUE_METRICS: ChartMetric[] = [
  { id: "revenue", label: "Revenue", kind: "money" },
  { id: "coins", label: "Coins sold", kind: "number" },
];

export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How kuzu is doing.",
  sampleNote: "Sample data.",
  signupsTitle: "Sign-ups, last 30 days",
  revenueTitle: "Coin sales, last 30 days",
  attentionTitle: "Needs your attention",
  attentionClear: "Nothing needs attention right now.",
  recentTitle: "Newest businesses",
  viewAll: "View all",
};
