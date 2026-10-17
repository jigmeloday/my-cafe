import { PromotionGrid } from "@/components/public/promotion-grid";
import type { PromotionCardData } from "@/components/public/model/promotion.type";
import { EmptyState } from "@/components/shared/empty-state";

import { PROFILE_COPY } from "../constant/profile.constant";

export function SavedOffers({ items, limit }: { items: PromotionCardData[]; limit?: number }) {
  const shown = items.slice(0, limit);
  if (shown.length === 0) {
    return <EmptyState title={PROFILE_COPY.savedEmptyTitle} description={PROFILE_COPY.savedEmptyDescription} />;
  }

  return <PromotionGrid items={shown} defaultSaved />;
}
