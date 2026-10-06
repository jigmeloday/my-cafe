import { META_SEPARATOR } from "@/components/public/constant/detail.constant";
import { slugFromHref } from "@/components/public/utils/detail.utils";

import {
  BUSINESS_ABOUT,
  BUSINESS_HOURS,
  DEFAULT_CATEGORY,
  LIST_LIMIT,
} from "../constant/business.constant";
import { BUSINESS_ACTIVITY } from "../constant/business-activity.data";
import { BUSINESSES, REFERENCED_BUSINESSES } from "../constant/businesses.data";
import type {
  ActivityItem,
  ActivityStatus,
  BusinessProfile,
} from "../model/business.type";

type BusinessBase = Pick<
  BusinessProfile,
  "name" | "category" | "area" | "badge" | "openedLabel" | "openingOffer"
>;

function findBase(slug: string): BusinessBase | null {
  const item = BUSINESSES.find((i) => slugFromHref(i.href) === slug);
  if (item) {
    const [place = "", openedLabel = ""] = item.meta;
    const [category = "", area = ""] = place.split(META_SEPARATOR);
    return {
      name: item.title,
      category,
      area,
      badge: item.badge,
      openedLabel,
      openingOffer: item.highlight,
    };
  }
  const ref = REFERENCED_BUSINESSES.find((b) => b.slug === slug);
  if (!ref) return null;
  return {
    name: ref.name,
    category: DEFAULT_CATEGORY,
    area: ref.area,
    openedLabel: "",
    openingOffer: "",
  };
}

export function getBusinessProfile(slug: string): BusinessProfile | null {
  const base = findBase(slug);
  if (!base) return null;

  return {
    ...base,
    slug,
    about: BUSINESS_ABOUT,
    hours: BUSINESS_HOURS,
    activity: BUSINESS_ACTIVITY,
    similar: BUSINESSES.filter((i) => slugFromHref(i.href) !== slug).slice(
      0,
      LIST_LIMIT,
    ),
  };
}

export const allBusinessSlugs = () => [
  ...new Set([
    ...BUSINESSES.map((i) => slugFromHref(i.href)),
    ...REFERENCED_BUSINESSES.map((b) => b.slug),
  ]),
];

// JS getDay(): 0 = Sunday. BUSINESS_HOURS starts on Monday.
export const todayIndex = (date = new Date()) => (date.getDay() + 6) % 7;

export const itemsByStatus = (items: ActivityItem[], status: ActivityStatus) =>
  items.filter((i) => i.status === status);
