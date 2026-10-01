import { PromotionCard } from "../promotion-card";
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
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        {items.map((item) => (
          <li key={item.id}>
            <PromotionCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
