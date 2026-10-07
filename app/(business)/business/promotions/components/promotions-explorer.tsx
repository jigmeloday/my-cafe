"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/server/actions/action.type";

import {
  DEFAULT_FILTERS,
  PROMOTIONS_COPY,
} from "../constant/promotion.constant";
import { PROMOTION_ITEMS } from "../constant/promotions.data";
import type { PromotionFilters } from "../model/promotion.type";
import { filterPromotions, hasActiveFilters } from "../utils/promotion.utils";
import { PromotionsTable } from "./promotions-table";
import { PromotionsToolbar } from "./promotions-toolbar";

export function PromotionsExplorer() {
  const [filters, setFilters] = useState<PromotionFilters>(DEFAULT_FILTERS);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterPromotions(PROMOTION_ITEMS, filters);

  return (
    <div className="space-y-4">
      <PromotionsToolbar filters={filters} onChange={setFilters} />
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      {items.length > 0 ? (
        <PromotionsTable items={items} onResult={setNotice} />
      ) : (
        <EmptyState
          title={PROMOTIONS_COPY.emptyTitle}
          description={PROMOTIONS_COPY.emptyDescription}
          action={
            hasActiveFilters(filters) ? (
              <Button
                variant="secondary"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear filters
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
