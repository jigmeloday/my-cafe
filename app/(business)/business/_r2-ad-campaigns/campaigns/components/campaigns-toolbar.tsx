"use client";

import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";

import { CAMPAIGNS_COPY, STATUS_FILTERS } from "../constant/campaign.constant";
import { CAMPAIGN_ITEMS } from "../constant/campaigns.data";
import type { CampaignFilters } from "../model/campaign.type";
import { countByStatus } from "../utils/campaign.utils";

interface CampaignsToolbarProps {
  filters: CampaignFilters;
  onChange: (next: CampaignFilters) => void;
}

export function CampaignsToolbar({ filters, onChange }: CampaignsToolbarProps) {
  const options = STATUS_FILTERS.map(({ id, label }) => ({
    id,
    label: `${label} ${countByStatus(CAMPAIGN_ITEMS, id as CampaignFilters["status"])}`,
  }));

  return (
    <div className="space-y-3">
      <SearchInput
        className="sm:max-w-sm"
        aria-label={CAMPAIGNS_COPY.searchPlaceholder}
        placeholder={CAMPAIGNS_COPY.searchPlaceholder}
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />
      <FilterChips
        options={options}
        active={filters.status}
        onChange={(status) =>
          onChange({ ...filters, status: status as CampaignFilters["status"] })
        }
      />
    </div>
  );
}
