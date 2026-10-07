"use client";

import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PROMOTIONS_COPY,
  STATUS_FILTERS,
  TYPE_FILTER_OPTIONS,
} from "../constant/promotion.constant";
import { PROMOTION_ITEMS } from "../constant/promotions.data";
import type { PromotionFilters, PromotionType } from "../model/promotion.type";
import { countByStatus } from "../utils/promotion.utils";

interface PromotionsToolbarProps {
  filters: PromotionFilters;
  onChange: (next: PromotionFilters) => void;
}

export function PromotionsToolbar({
  filters,
  onChange,
}: PromotionsToolbarProps) {
  const statusOptions = STATUS_FILTERS.map(({ id, label }) => ({
    id,
    label: `${label} ${countByStatus(PROMOTION_ITEMS, id as PromotionFilters["status"])}`,
  }));

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          className="flex-1"
          aria-label={PROMOTIONS_COPY.searchPlaceholder}
          placeholder={PROMOTIONS_COPY.searchPlaceholder}
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
        />
        <Select
          items={TYPE_FILTER_OPTIONS}
          value={filters.type}
          onValueChange={(type) =>
            onChange({
              ...filters,
              type: (type ?? "ALL") as PromotionType | "ALL",
            })
          }
        >
          <SelectTrigger aria-label="Filter by type" className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTER_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <FilterChips
        options={statusOptions}
        active={filters.status}
        onChange={(status) =>
          onChange({ ...filters, status: status as PromotionFilters["status"] })
        }
      />
    </div>
  );
}
