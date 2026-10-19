"use client";

import { FilterChips } from "@/components/shared/filter-chips";
import { SearchInput } from "@/components/shared/search-input";

import {
  EMAIL_COPY,
  STATUS_FILTERS,
} from "../constant/email-campaign.constant";
import { EMAIL_CAMPAIGNS } from "../constant/email-campaigns.data";
import type { EmailCampaignFilters } from "../model/email-campaign.type";
import { countByStatus } from "../utils/email-campaign.utils";

interface CampaignsToolbarProps {
  filters: EmailCampaignFilters;
  onChange: (next: EmailCampaignFilters) => void;
}

export function CampaignsToolbar({ filters, onChange }: CampaignsToolbarProps) {
  const options = STATUS_FILTERS.map(({ id, label }) => ({
    id,
    label: `${label} ${countByStatus(EMAIL_CAMPAIGNS, id as EmailCampaignFilters["status"])}`,
  }));

  return (
    <div className="space-y-3">
      <SearchInput
        className="sm:max-w-sm"
        aria-label={EMAIL_COPY.searchPlaceholder}
        placeholder={EMAIL_COPY.searchPlaceholder}
        value={filters.query}
        onChange={(e) => onChange({ ...filters, query: e.target.value })}
      />
      <FilterChips
        options={options}
        active={filters.status}
        onChange={(status) =>
          onChange({
            ...filters,
            status: status as EmailCampaignFilters["status"],
          })
        }
      />
    </div>
  );
}
