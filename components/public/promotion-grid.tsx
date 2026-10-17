import { cn } from "@/lib/utils";

import type { PromotionCardData } from "./model/promotion.type";
import { PromotionCard } from "./promotion-card";

interface PromotionGridProps {
  items: PromotionCardData[];
  className?: string;
  /** Pass true on lists of things the person already saved. */
  defaultSaved?: boolean;
}

export function PromotionGrid({ items, className, defaultSaved }: PromotionGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <li key={item.id}>
          <PromotionCard item={item} defaultSaved={defaultSaved} />
        </li>
      ))}
    </ul>
  );
}
