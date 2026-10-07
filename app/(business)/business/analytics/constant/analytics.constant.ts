import type { ChartMetric } from "@/components/business/charts/model/chart.type";

import type { BannerRun, RangeDays } from "../model/analytics.type";

export const RANGES: { id: string; label: string; days: RangeDays }[] = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "14", label: "Last 14 days", days: 14 },
  { id: "30", label: "Last 30 days", days: 30 },
];

export const DEFAULT_RANGE = "14";

export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "posts", label: "Posts" },
  { id: "banners", label: "Banners" },
  { id: "emails", label: "Emails" },
  { id: "audience", label: "Audience" },
];

export const METRICS: ChartMetric[] = [
  { id: "views", label: "Views", kind: "number" },
  { id: "clicks", label: "Clicks", kind: "number" },
  { id: "saves", label: "Saves", kind: "number" },
];

export const BANNER_METRICS: ChartMetric[] = [
  { id: "impressions", label: "Impressions", kind: "number" },
  { id: "clicks", label: "Clicks", kind: "number" },
];

/** Sample data settings. Replace with real tracked events once clicks are recorded. */
export const SAMPLE_END_DATE = "2026-10-07";
export const SAMPLE_DAYS = 60;

/** While a banner runs, this percent of that day's clicks come from it. */
export const BANNER_CLICK_SHARE = 40;

/** Sources other than the banner. Larger weight = bigger share of the remaining clicks. */
export const SOURCE_WEIGHTS = [
  { id: "discover", label: "Discover", weight: 24 },
  { id: "deals", label: "Deals", weight: 22 },
  { id: "search", label: "Search", weight: 18 },
  { id: "email", label: "Email campaigns", weight: 16 },
  { id: "events", label: "Events", weight: 12 },
];
export const BANNER_SOURCE = { id: "banner", label: "Homepage banner" };

export const PROMOTION_WEIGHTS: Record<
  string,
  { views: number; clicks: number; saves: number }
> = {
  p1: { views: 34, clicks: 38, saves: 40 },
  p2: { views: 26, clicks: 31, saves: 27 },
  p3: { views: 14, clicks: 14, saves: 14 },
  p5: { views: 8, clicks: 7, saves: 8 },
  p6: { views: 10, clicks: 6, saves: 7 },
  p7: { views: 8, clicks: 4, saves: 4 },
};

// Matches the banner purchases in the wallet history.
export const BANNER_RUNS: BannerRun[] = [
  { id: "b1", promotionId: "p2", start: "2026-10-01", days: 3, coins: 600 },
  { id: "b2", promotionId: "p1", start: "2026-10-05", days: 7, coins: 1400 },
];

export const AUDIENCE_LOCATIONS = [
  { id: "thimphu", label: "Thimphu", weight: 50 },
  { id: "paro", label: "Paro", weight: 14 },
  { id: "punakha", label: "Punakha", weight: 10 },
  { id: "chhukha", label: "Chhukha", weight: 9 },
  { id: "bumthang", label: "Bumthang", weight: 5 },
  { id: "other", label: "Other dzongkhags", weight: 12 },
];

/** Percent of followers interested in each topic (people can pick several). */
export const AUDIENCE_INTERESTS = [
  { id: "food", label: "Food & drink", percent: 41 },
  { id: "fashion", label: "Fashion", percent: 33 },
  { id: "events", label: "Events", percent: 27 },
  { id: "wellness", label: "Wellness", percent: 18 },
  { id: "cafes", label: "Cafés", percent: 16 },
];

export const EMAIL_METRICS: ChartMetric[] = [
  { id: "open", label: "Open rate", kind: "permille" },
  { id: "click", label: "Click rate", kind: "permille" },
  { id: "recipients", label: "Recipients", kind: "number" },
];

export const ANALYTICS_COPY = {
  title: "Analytics",
  subtitle: "How people find and click on your promotions.",
  sampleNote:
    "Sample numbers. Real counts appear once click tracking is switched on.",
  vsPrevious: "vs previous period",
  chartTitle: "Performance",
  sourcesTitle: "Where clicks come from",
  funnelTitle: "From view to save",
  postsBarsTitle: "Clicks per post",
  postsTrendTitle: "Post trend",
  postsTableTitle: "All posts",
  postsHint: "Each click is someone opening your promotion's offer.",
  typesTitle: "Clicks by type",
  bannerChartTitle: "Banner performance",
  bannerRunsTitle: "Banner runs",
  noBanner: "You haven't run a banner in this period.",
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
