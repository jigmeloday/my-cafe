import { PromotionGrid } from "../promotion-grid";
import type { PromotionCardData } from "../model/promotion.type";

interface RelatedGridProps {
  title: string;
  items: PromotionCardData[];
}

export function RelatedGrid({ title, items }: RelatedGridProps) {
  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2>{title}</h2>
      <PromotionGrid items={items} />
    </section>
  );
}
