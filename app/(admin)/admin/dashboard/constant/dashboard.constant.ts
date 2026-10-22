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

export const TRAFFIC_METRICS: ChartMetric[] = [
  { id: "visitors", label: "Visitors", kind: "number" },
  { id: "visits", label: "Pages opened", kind: "number" },
];

/** What each part of the public site is called in the traffic list. */
export const SECTION_LABELS: Record<string, string> = {
  home: "Home page",
  discover: "Discover",
  deals: "Deals",
  events: "Events",
  search: "Search",
  business: "Business pages",
  promotion: "Promotion pages",
  other: "Other pages",
};

export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How Nook is doing.",
  membersTitle: "Customers and businesses",
  membersHint: "Everyone on the site right now.",
  signupsTitle: "Sign-ups, last 30 days",
  coinsTitle: "Coin activity, last 30 days",
  trafficTitle: "Visitors, last 30 days",
  sectionsTitle: "Most visited",
  trafficNote: "Counted without cookies. A visitor is counted once a day, so a person who returns on another day counts again. Robots and signed-in business owners on their own pages are left out.",
  noTraffic: "No visits counted yet.",
  attentionTitle: "Needs your attention",
  attentionClear: "Nothing needs attention right now.",
  recentTitle: "Newest businesses",
  recentEmpty: "No businesses have joined yet.",
  viewAll: "View all",
};
