import type { NotificationItem } from "../model/profile.type";
import { EVENTS } from "../../../(public)/events/constant/events.data";
import { DEALS } from "../../../(public)/deals/constant/deals.data";
import { NEW_PLACES } from "../../../(public)/discover/constant/discover.data";

export const SAVED_OFFERS = DEALS.slice(0, 4);
export const FOLLOWING_PLACES = NEW_PLACES.slice(0, 4);

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    title: "[Pizzeria] posted a new offer",
    description: "Second pizza free on Fridays",
    time: "2 hours ago",
  },
  {
    id: "n2",
    title: "[Café name] is hosting an event",
    description: "Acoustic open mic · Thu 12 Nov",
    time: "Yesterday",
  },
  {
    id: "n3",
    title: "[Textile house] offer ends soon",
    description: "20% off hand-woven kira · until 20 Oct",
    time: "2 days ago",
  },
];

export const RECOMMENDED_OFFERS = DEALS.slice(4, 8);
export const WEEKEND_EVENTS = EVENTS.filter((e) =>
  e.tags.includes("weekend"),
).slice(0, 4);
export const SELECTED_INTERESTS: string[] = [];
