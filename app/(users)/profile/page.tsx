import type { Metadata } from "next";

import { getCurrentProfile } from "@/services/profile/current-profile";

import { PromotionGrid } from "@/components/public/promotion-grid";

import { CompletionCard } from "./components/completion-card";
import { DetailsSummary } from "./components/details-summary";
import { FollowingList } from "./components/following-list";
import { NotificationList } from "./components/notification-list";
import { PreviewSection } from "./components/preview-section";
import { SavedOffers } from "./components/saved-offers";
import { OVERVIEW_COPY } from "./constant/profile.constant";
import { WEEKEND_EVENTS } from "./constant/profile.data";
import { getEngagement } from "./utils/engagement.server";
import { getCompletion, getSummary } from "./utils/profile.utils";

export const metadata: Metadata = { title: "Overview — kuzu" };

export default async function OverviewPage() {
  const profile = await getCurrentProfile();
  const engagement = await getEngagement();
  if (!engagement) return null;
  const { percent } = getCompletion({
    user: profile,
    interestCount: profile.interests.length,
    followingCount: engagement.following.length,
  });

  return (
    <div className="space-y-10">
      <CompletionCard percent={percent} />
      <PreviewSection
        id="details"
        title={OVERVIEW_COPY.detailsTitle}
        href="/profile/personal"
        linkLabel={OVERVIEW_COPY.edit}
      >
        <DetailsSummary rows={getSummary(profile)} />
      </PreviewSection>
      <PreviewSection
        id="updates"
        title={OVERVIEW_COPY.updatesTitle}
        href="/profile/notifications"
      >
        <NotificationList items={engagement.notifications} limit={2} />
      </PreviewSection>
      <PreviewSection
        id="favorites"
        title={OVERVIEW_COPY.favoritesTitle}
        href="/profile/favorites"
      >
        <SavedOffers items={engagement.favorites} limit={4} />
      </PreviewSection>
      <PreviewSection
        id="following"
        title={OVERVIEW_COPY.followingTitle}
        href="/profile/following"
      >
        <FollowingList places={engagement.following} limit={4} />
      </PreviewSection>
      <PreviewSection
        id="picked"
        title={OVERVIEW_COPY.recommendedTitle}
        description={engagement.recommended.personal ? OVERVIEW_COPY.recommendedDescription : OVERVIEW_COPY.recommendedFallback}
      >
        <PromotionGrid items={engagement.recommended.items} />
      </PreviewSection>
      <PreviewSection
        id="weekend"
        title={OVERVIEW_COPY.weekendTitle}
        href="/events"
      >
        <PromotionGrid items={WEEKEND_EVENTS} />
      </PreviewSection>
    </div>
  );
}
