export interface PromotionCardData {
  id: string;
  badge?: string;
  title: string;
  meta: string[];
  highlight: string;
  href: string;
  /** A stored photo. Without one the card shows a placeholder. */
  imageUrl?: string;
}

export interface TaggedPromotion extends PromotionCardData {
  tags: string[];
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface ExplorerCopy {
  /** Shown when there is nothing at all yet (not when a filter hides everything). */
  nothingTitle?: string;
  nothingDescription?: string;
  emptyTitle: string;
  emptyDescription: string;
  resetLabel: string;
}
