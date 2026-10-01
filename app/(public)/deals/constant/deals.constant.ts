import type { FilterOption } from "@/components/public/model/promotion.type";

export const DEAL_FILTERS: FilterOption[] = [
  { id: "all", label: "All deals" },
  { id: "today", label: "Ends today" },
  { id: "week", label: "This week" },
  { id: "bogo", label: "Buy 1 get 1" },
  { id: "percent", label: "% off" },
  { id: "food", label: "Food & drink" },
  { id: "fashion", label: "Fashion" },
  { id: "electronics", label: "Electronics" },
  { id: "wellness", label: "Wellness" },
];

export const DEALS_COPY = {
  title: "Deals",
  description:
    "Discounts, bundles and limited-time offers from local businesses.",
  emptyTitle: "No deals match this filter",
  emptyDescription: "Try another filter to see more offers.",
  resetLabel: "Show all deals",
};
