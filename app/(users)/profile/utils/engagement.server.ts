import { cache } from "react";

import { formatDate } from "@/lib/formatters/date";
import { getCurrentProfile } from "@/services/profile/current-profile";
import { engagementService } from "@/services/engagement/engagement.service";
import { getCurrentUser } from "@/lib/session";

import { DEALS } from "../../../(public)/deals/constant/deals.data";
import { EVENTS } from "../../../(public)/events/constant/events.data";
import { REFERENCED_BUSINESSES } from "../../../(public)/businesses/constant/businesses.data";
import { BUSINESSES } from "../../../(public)/businesses/constant/businesses.data";
import { PROMOTIONS } from "../../../(public)/promotions/constant/promotions.data";
import { slugFromHref } from "@/components/public/utils/detail.utils";
import { META_SEPARATOR } from "@/components/public/constant/detail.constant";
import type { NotificationItem } from "../model/profile.type";
import { recommendOffers, resolveByHref, resolvePlaces } from "./engagement.utils";

const CATALOG = [...PROMOTIONS, ...EVENTS, ...DEALS];

// Every business we know about. Later entries win, so "new places" beat names mentioned by offers and events
// (the same priority the public business page uses).
const PLACES = [
  ...REFERENCED_BUSINESSES,
  ...BUSINESSES.map((b) => ({
    slug: slugFromHref(b.href),
    name: b.title,
    area: b.meta[0]?.split(META_SEPARATOR).join(" · ") ?? "",
  })),
];

/** Everything the profile pages need about what this person saved, followed and was told. Loaded once per request. */
export const getEngagement = cache(async () => {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  if (!user) return null;

  const [snapshot, notifications] = await Promise.all([
    engagementService.snapshot(user.id),
    engagementService.notifications(user.id),
  ]);

  const favorites = resolveByHref(snapshot.favorites, CATALOG);
  const following = resolvePlaces(snapshot.following, PLACES);
  const items: NotificationItem[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatDate(n.createdAt.toISOString()),
  }));
  const recommended = recommendOffers(profile.interests, snapshot.favorites, DEALS);

  return { favorites, following, notifications: items, recommended };
});
