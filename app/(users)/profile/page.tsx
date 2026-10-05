import type { Metadata } from "next";

import { PromotionGrid } from "@/components/public/promotion-grid";

import { CompletionCard } from "./components/completion-card";
import { DetailsSummary } from "./components/details-summary";
import { FollowingList } from "./components/following-list";
import { NotificationList } from "./components/notification-list";
import { PreviewSection } from "./components/preview-section";
import { SavedOffers } from "./components/saved-offers";
import { OVERVIEW_COPY, PROFILE_USER } from "./constant/profile.constant";
import {
  FOLLOWING_PLACES,
  RECOMMENDED_OFFERS,
  SELECTED_INTERESTS,
  WEEKEND_EVENTS,
} from "./constant/profile.data";
import { getCompletion, getSummary } from "./utils/profile.utils";

export const metadata: Metadata = { title: "Overview — kuzu" };

export default function OverviewPage() {
  const { percent } = getCompletion({
    user: PROFILE_USER,
    interestCount: SELECTED_INTERESTS.length,
    followingCount: FOLLOWING_PLACES.length,
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
        <DetailsSummary rows={getSummary(PROFILE_USER)} />
      </PreviewSection>
      <PreviewSection
        id="updates"
        title={OVERVIEW_COPY.updatesTitle}
        href="/profile/notifications"
      >
        <NotificationList limit={2} />
      </PreviewSection>
      <PreviewSection
        id="favorites"
        title={OVERVIEW_COPY.favoritesTitle}
        href="/profile/favorites"
      >
        <SavedOffers limit={4} />
      </PreviewSection>
      <PreviewSection
        id="following"
        title={OVERVIEW_COPY.followingTitle}
        href="/profile/following"
      >
        <FollowingList limit={4} />
      </PreviewSection>
      <PreviewSection
        id="picked"
        title={OVERVIEW_COPY.recommendedTitle}
        description={OVERVIEW_COPY.recommendedDescription}
      >
        <PromotionGrid items={RECOMMENDED_OFFERS} />
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
