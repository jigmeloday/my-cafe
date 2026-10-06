export interface PromotionCardData {
  id: string;
  badge?: string;
  title: string;
  meta: string[];
  highlight: string;
  href: string;
}

export interface TaggedPromotion extends PromotionCardData {
  tags: string[];
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface ExplorerCopy {
  emptyTitle: string;
  emptyDescription: string;
  resetLabel: string;
}
