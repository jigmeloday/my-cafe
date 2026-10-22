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
}

export interface DetailShop {
  name: string;
  area: string;
  href: string;
}

export interface ShopLine {
  key: "hours" | "phone" | "address" | "website";
  text: string;
  /** Makes the line a link (a phone number or website). */
  href?: string;
}

export interface DetailCta {
  label: string;
  /** Where the button goes. Opened in a new tab when it leaves the site. */
  href: string;
  /** True when the button opens a WhatsApp chat, so its clicks are counted as chats. */
  chat?: boolean;
}

/** Plain facts about a promotion for search engines (dates are like "2026-11-01"). */
export interface DetailSeo {
  description: string;
  startsAt?: string;
  endsAt?: string;
  place: string;
  street?: string;
  town?: string;
  dzongkhag?: string;
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
  /** Set for real promotions. Used to count views and clicks. */
  promotionId?: string;
  photos?: string[];
  cta?: DetailCta;
  shopLines?: ShopLine[];
  shopLogo?: string;
  seo?: DetailSeo;
  /** Overrides the "back" link (used by the owner's preview, which must stay inside the dashboard). */
  back?: { label: string; href: string };
}
