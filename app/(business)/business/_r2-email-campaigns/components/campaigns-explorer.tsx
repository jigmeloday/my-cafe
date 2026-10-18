"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/server/actions/action.type";

import {
  DEFAULT_FILTERS,
  EMAIL_COPY,
} from "../constant/email-campaign.constant";
import { EMAIL_CAMPAIGNS } from "../constant/email-campaigns.data";
import type { EmailCampaignFilters } from "../model/email-campaign.type";
import { filterCampaigns } from "../utils/email-campaign.utils";
import { CampaignsTable } from "./campaigns-table";
import { CampaignsToolbar } from "./campaigns-toolbar";

export function CampaignsExplorer() {
  const [filters, setFilters] = useState<EmailCampaignFilters>(DEFAULT_FILTERS);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterCampaigns(EMAIL_CAMPAIGNS, filters);

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
          title={EMAIL_COPY.emptyTitle}
          description={EMAIL_COPY.emptyDescription}
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
