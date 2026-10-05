import type { PromotionCardData } from "./promotion.type";

export type DetailKind = "promotion" | "event";

export interface DetailFact {
  label: string;
  value: string;
}

export interface DetailKindConfig {
  backLabel: string;
  backHref: string;
  asideLabel: string;
  asideNote: string;
  factLabels: string[];
  relatedTitle: string;
  description: string[];
}

export interface DetailShop {
  name: string;
  area: string;
  href: string;
}

export interface DetailData {
  kind: DetailKind;
  slug: string;
  title: string;
  badge?: string;
  highlight: string;
  facts: DetailFact[];
  description: string[];
  shop: DetailShop;
  related: PromotionCardData[];
}
