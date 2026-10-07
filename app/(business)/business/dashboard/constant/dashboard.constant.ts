export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How your business is doing on kuzu.",
  createPromotion: "Create promotion",
  createCampaign: "Create campaign",
  campaignsTitle: "Recent campaigns",
  campaignsEmpty: "You haven't sent a campaign yet.",
  promotionsTitle: "Promotions",
  viewAll: "View all",
};

export const RECENT_LIMIT = 4;

/** Days shown in the overview graphs. */
export const PERFORMANCE_DAYS = 14;
export const FOLLOWER_DAYS = 30;

export const CHART_TITLES = {
  performance: "Performance, last 14 days",
  followers: "Followers, last 30 days",
};

export const FOLLOWER_METRIC = {
  id: "followers",
  label: "Followers",
  kind: "number",
} as const;
