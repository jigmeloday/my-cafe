import { cache } from "react";

import { formatDate } from "@/lib/formatters/date";
import { getCurrentUser } from "@/lib/session";
import { discoveryService } from "@/services/discovery/discovery.service";
import { engagementService } from "@/services/engagement/engagement.service";
import { getCurrentProfile } from "@/services/profile/current-profile";

import type { NotificationItem } from "../model/profile.type";

/** Everything the profile pages need about what this person saved, followed and was told. Loaded once per request. */
export const getEngagement = cache(async () => {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();
  if (!user) return null;

  const [snapshot, notifications] = await Promise.all([engagementService.snapshot(user.id), engagementService.notifications(user.id)]);

  const [favorites, following, recommended, weekend] = await Promise.all([
    discoveryService.savedCards(snapshot.favorites),
    discoveryService.followedPlaces(snapshot.following),
    discoveryService.recommended(profile.interests, snapshot.favorites),
    discoveryService.weekendEvents(),
  ]);

  const items: NotificationItem[] = notifications.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    time: formatDate(n.createdAt.toISOString()),
  }));

  return { favorites, following, notifications: items, recommended, weekend };
});
