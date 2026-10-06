import type { MetricOption } from "../model/dashboard.type";

export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How your business is performing over the last 14 days.",
  createPromotion: "Create promotion",
  createCampaign: "Create campaign",
  chartTitle: "Performance",
  showTable: "View as table",
  showChart: "View as chart",
  walletTitle: "Wallet",
  walletSpent: "Spent this month",
  walletCampaigns: "Active campaigns",
  addFunds: "Add funds",
  campaignsTitle: "Campaigns",
  campaignsEmpty: "No campaigns yet.",
  promotionsTitle: "Promotions",
  viewAll: "View all",
  boost: "Boost",
  boosted: "Boosted",
};

export const METRIC_OPTIONS: MetricOption[] = [
  { id: "clicks", label: "Clicks" },
  { id: "impressions", label: "Impressions" },
  { id: "spend", label: "Spend" },
];

export const CHART_TICKS = 3;
export const LABEL_EVERY = 3;
