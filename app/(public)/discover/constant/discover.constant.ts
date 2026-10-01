import type { FilterOption } from "@/components/public/model/promotion.type";

export const PLACE_FILTERS: FilterOption[] = [
  { id: "all", label: "All new places" },
  { id: "week", label: "Opened this week" },
  { id: "month", label: "This month" },
  { id: "food", label: "Food & drink" },
  { id: "cafe", label: "Cafés" },
  { id: "shops", label: "Shops" },
  { id: "wellness", label: "Wellness" },
  { id: "stays", label: "Stays" },
];

export const DISCOVER_COPY = {
  title: "New places",
  description: "Restaurants, shops and services that opened recently near you.",
  emptyTitle: "No new places match this filter",
  emptyDescription: "Try another filter to see what else just opened.",
  resetLabel: "Show all new places",
};
