import type { ActivityItem, ActivityStatus } from "../model/business.type";

// JS getDay(): 0 = Sunday. Opening hours start on Monday.
export const todayIndex = (date = new Date()) => (date.getDay() + 6) % 7;

export const itemsByStatus = (items: ActivityItem[], status: ActivityStatus) => items.filter((i) => i.status === status);
