import {
  DETAIL_KINDS,
  META_SEPARATOR,
  RELATED_COUNT,
} from "../constant/detail.constant";
import type { DetailData, DetailFact, DetailKind } from "../model/detail.type";
import type { PromotionCardData } from "../model/promotion.type";

export const slugFromHref = (href: string) => href.split("/").pop() ?? "";

export function uniqueByHref<T extends PromotionCardData>(items: T[]): T[] {
  return [...new Map(items.map((i) => [i.href, i])).values()];
}

const zipFacts = (labels: string[], values: string[]): DetailFact[] =>
  labels.map((label, i) => ({ label, value: values[i] }));

function factValues(kind: DetailKind, item: PromotionCardData): string[] {
  const [place = "", when = ""] = item.meta;
  const [category = "", area = ""] = place.split(META_SEPARATOR);
  if (kind === "promotion") return [item.highlight, when, area, category];
  if (kind === "event") return [when, category, item.highlight, area];
  return [category, area, when, item.highlight];
}

export function buildDetail(
  kind: DetailKind,
  slug: string,
  items: PromotionCardData[],
): DetailData | null {
  const item = items.find((i) => slugFromHref(i.href) === slug);
  if (!item) return null;

  const config = DETAIL_KINDS[kind];
  const [place = ""] = item.meta;
  const [first = "", second = ""] = place.split(META_SEPARATOR);
  const isBusiness = kind === "business";

  return {
    kind,
    slug,
    title: item.title,
    badge: item.badge,
    subtitle: place,
    highlight: item.highlight,
    facts: zipFacts(config.factLabels, factValues(kind, item)),
    description: config.description,
    shop: {
      name: isBusiness ? item.title : first,
      area: second,
      category: isBusiness ? first : undefined,
    },
    related: items.filter((i) => i.href !== item.href).slice(0, RELATED_COUNT),
  };
}
