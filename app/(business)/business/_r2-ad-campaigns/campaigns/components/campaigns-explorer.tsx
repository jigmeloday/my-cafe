"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/server/actions/action.type";

import { CAMPAIGNS_COPY, DEFAULT_FILTERS } from "../constant/campaign.constant";
import { CAMPAIGN_ITEMS } from "../constant/campaigns.data";
import type { CampaignFilters } from "../model/campaign.type";
import { filterCampaigns } from "../utils/campaign.utils";
import { CampaignsTable } from "./campaigns-table";
import { CampaignsToolbar } from "./campaigns-toolbar";

export function CampaignsExplorer() {
  const [filters, setFilters] = useState<CampaignFilters>(DEFAULT_FILTERS);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterCampaigns(CAMPAIGN_ITEMS, filters);

  return (
    <div className="space-y-4">
      <CampaignsToolbar filters={filters} onChange={setFilters} />
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      {items.length > 0 ? (
        <CampaignsTable items={items} onResult={setNotice} />
      ) : (
        <EmptyState
          title={CAMPAIGNS_COPY.emptyTitle}
          description={CAMPAIGNS_COPY.emptyDescription}
          action={
            <Button
              variant="secondary"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
