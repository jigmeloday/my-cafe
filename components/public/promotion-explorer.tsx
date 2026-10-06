"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FilterChips } from "@/components/shared/filter-chips";
import { Button } from "@/components/ui/button";

import { ALL_FILTER_ID, PROMOTION_GRID } from "./constant/promotion.constant";
import type {
  ExplorerCopy,
  FilterOption,
  TaggedPromotion,
} from "./model/promotion.type";
import { PromotionCard } from "./promotion-card";

interface PromotionExplorerProps {
  items: TaggedPromotion[];
  filters: FilterOption[];
  copy: ExplorerCopy;
}

export function PromotionExplorer({
  items,
  filters,
  copy,
}: PromotionExplorerProps) {
  const [filter, setFilter] = useState(ALL_FILTER_ID);
  const visible =
    filter === ALL_FILTER_ID
      ? items
      : items.filter((i) => i.tags.includes(filter));

  return (
    <div className="space-y-8">
      <FilterChips options={filters} active={filter} onChange={setFilter} />
      {visible.length > 0 ? (
        <ul className={PROMOTION_GRID}>
          {visible.map((item) => (
            <li key={item.id}>
              <PromotionCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          title={copy.emptyTitle}
          description={copy.emptyDescription}
          action={
            <Button onClick={() => setFilter(ALL_FILTER_ID)}>
              {copy.resetLabel}
            </Button>
          }
        />
      )}
    </div>
  );
}
