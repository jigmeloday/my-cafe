import { PromotionGrid } from "@/components/public/promotion-grid";
import { EmptyState } from "@/components/shared/empty-state";

import { PROFILE_COPY } from "../constant/profile.constant";
import { SAVED_OFFERS } from "../constant/profile.data";

export function SavedOffers({ limit }: { limit?: number }) {
  const items = SAVED_OFFERS.slice(0, limit);
  if (items.length === 0) {
    return (
      <EmptyState
        title={PROFILE_COPY.savedEmptyTitle}
        description={PROFILE_COPY.savedEmptyDescription}
      />
    );
  }

  return <PromotionGrid items={items} />;
}
