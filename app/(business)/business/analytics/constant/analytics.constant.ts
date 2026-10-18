import type { ChartMetric } from "@/components/business/charts/model/chart.type";

import type { RangeDays } from "../model/analytics.type";

export const RANGES: { id: string; label: string; days: RangeDays }[] = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "14", label: "Last 14 days", days: 14 },
  { id: "30", label: "Last 30 days", days: 30 },
];

export const DEFAULT_RANGE = "14";

export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "posts", label: "Posts" },
  { id: "audience", label: "Audience" },
];

export const METRICS: ChartMetric[] = [
  { id: "views", label: "Views", kind: "number" },
  { id: "clicks", label: "Clicks", kind: "number" },
  { id: "saves", label: "Saves", kind: "number" },
];

/** Days of history loaded: enough for the longest range and the period before it. */
export const HISTORY_DAYS = 60;

/** Where a click came from. Anything not listed counts as "other". */
export const SOURCES = [
  { id: "home", label: "Home page" },
  { id: "discover", label: "Discover" },
  { id: "deals", label: "Deals" },
  { id: "events", label: "Events" },
  { id: "search", label: "Search" },
  { id: "other", label: "Elsewhere" },
];
export const OTHER_SOURCE = "other";

export const EMAIL_METRICS: ChartMetric[] = [
  { id: "open", label: "Open rate", kind: "permille" },
  { id: "click", label: "Click rate", kind: "permille" },
  { id: "recipients", label: "Recipients", kind: "number" },
];

export const ANALYTICS_COPY = {
  title: "Analytics",
  subtitle: "How people find and click on your promotions.",
  vsPrevious: "vs previous period",
  chartTitle: "Performance",
  sourcesTitle: "Where clicks come from",
  funnelTitle: "From view to save",
  postsBarsTitle: "Clicks per post",
  postsTrendTitle: "Post trend",
  postsTableTitle: "All posts",
  postsHint: "Each click is someone opening your promotion's offer.",
  typesTitle: "Clicks by type",
  emailChartTitle: "Campaign results",
  emailFunnelTitle: "From sent to clicked",
  emailTableTitle: "Sent campaigns",
  noEmails: "You haven't sent a campaign yet.",
  locationsTitle: "Where your followers live",
  interestsTitle: "What your followers like",
  reachTitle: "Who you can email",
  coinsTitle: "Where your coins went",
  noCoins: "You haven't spent any coins yet.",
};
