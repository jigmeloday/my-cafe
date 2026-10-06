import { DEALS } from "../../deals/constant/deals.data";
import { EVENTS } from "../../events/constant/events.data";
import type { ActivityItem, ActivityStatus } from "../model/business.type";

const tag = (
  items: typeof DEALS,
  status: ActivityStatus,
  badge?: string,
): ActivityItem[] =>
  items.map((item) => ({ ...item, status, badge: badge ?? item.badge }));

// Sample data: real activity will come from the business's promotions and events.
export const BUSINESS_ACTIVITY: ActivityItem[] = [
  ...tag(DEALS.slice(0, 3), "current", "Now on"),
  ...tag(EVENTS.slice(0, 1), "current", "Happening now"),
  ...tag(EVENTS.slice(1, 4), "upcoming", "Coming up"),
  ...tag(DEALS.slice(3, 5), "upcoming", "Starts soon"),
  ...tag(DEALS.slice(5, 8), "past", "Ended"),
  ...tag(EVENTS.slice(4, 6), "past", "Ended"),
];
