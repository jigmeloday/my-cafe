import type { ChartMetric } from "@/components/business/charts/model/chart.type";

export const RANGES = [
  { id: "7", label: "Last 7 days", days: 7 },
  { id: "14", label: "Last 14 days", days: 14 },
  { id: "30", label: "Last 30 days", days: 30 },
] as const;

export const DEFAULT_RANGE_ID = "14";

export const VISITOR_METRICS: ChartMetric[] = [
  { id: "visitors", label: "Visitors", kind: "number" },
  { id: "visits", label: "Pages opened", kind: "number" },
];

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

export const VISITORS_COPY = {
  title: "Visitors",
  subtitle: "Who comes to Nook, when, and what they look at. Counted without cookies, in Bhutan time.",
  chartTitle: "Visitors each day",
  sectionsTitle: "Where they go",
  hoursTitle: "Busiest hours",
  hoursHint: "Pages opened by hour of the day",
  weekdaysTitle: "Busiest days",
  weekdaysHint: "Average visitors on each day of the week",
  businessesTitle: "Most visited businesses",
  promotionsTitle: "Most viewed promotions",
  none: "Nothing counted in this time yet.",
  note: "A visitor is counted once a day, so a person who returns on another day counts again. Robots, and business owners on their own pages, are left out. The codes that tell visitors apart are deleted after 90 days.",
};
