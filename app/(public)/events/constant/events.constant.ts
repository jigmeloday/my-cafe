import type { FilterOption } from "@/components/public/model/promotion.type";

export const EVENT_FILTERS: FilterOption[] = [
  { id: "all", label: "All events" },
  { id: "weekend", label: "This weekend" },
  { id: "free", label: "Free" },
  { id: "music", label: "Music" },
  { id: "food", label: "Food & drink" },
  { id: "culture", label: "Culture" },
  { id: "kids", label: "Kids" },
  { id: "sports", label: "Sports" },
];

export const EVENTS_COPY = {
  title: "Events",
  description: "Festivals, workshops and nights out happening around Bhutan.",
  emptyTitle: "No events match this filter",
  emptyDescription: "Try another filter to see what else is on.",
  resetLabel: "Show all events",
};
