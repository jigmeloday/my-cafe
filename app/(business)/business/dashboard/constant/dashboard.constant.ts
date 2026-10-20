export const DASHBOARD_COPY = {
  title: "Overview",
  subtitle: "How your business is doing on Nook.",
  createPromotion: "Create promotion",
  // Used by the parked email campaigns card (Release 2).
  campaignsTitle: "Recent campaigns",
  campaignsEmpty: "You haven't sent a campaign yet.",
  promotionsTitle: "Promotions",
  noPromotionsTitle: "No promotions yet",
  noPromotionsDescription: "Create your first promotion to start getting views.",
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
