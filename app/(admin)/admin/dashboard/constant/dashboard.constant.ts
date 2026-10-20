import type { ChartMetric } from "@/components/business/charts/model/chart.type";

export const PERIOD_DAYS = 30;

export const SIGNUP_METRICS: ChartMetric[] = [
  { id: "users", label: "New users", kind: "number" },
  { id: "businesses", label: "New businesses", kind: "number" },
];

export const COIN_METRICS: ChartMetric[] = [
  { id: "coinsAdded", label: "Coins added", kind: "number" },
  { id: "coinsSpent", label: "Coins spent", kind: "number" },
];

export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How Nook is doing.",
  signupsTitle: "Sign-ups, last 30 days",
  coinsTitle: "Coin activity, last 30 days",
  attentionTitle: "Needs your attention",
  attentionClear: "Nothing needs attention right now.",
  recentTitle: "Newest businesses",
  recentEmpty: "No businesses have joined yet.",
  viewAll: "View all",
};
