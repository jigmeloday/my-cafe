import Link from "next/link";

import { CAMPAIGN_STATUS } from "@/components/business/constant/status.constant";
import { StatusBadge } from "@/components/shared/status-badge";

import { findPromotion } from "../../../promotions/constant/promotions.data";
import { CAMPAIGNS_COPY } from "../constant/campaign.constant";
import type { CampaignItem } from "../model/campaign.type";
import { CampaignActions } from "./campaign-actions";
import { FormPageHeader } from "./form-page-header";

export function CampaignDetailHeader({ item }: { item: CampaignItem }) {
  const { label, tone } = CAMPAIGN_STATUS[item.status];
  const promotion = findPromotion(item.promotionId);

  return (
    <div className="space-y-3">
      <FormPageHeader title={item.name} subtitle="" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <StatusBadge tone={tone}>{label}</StatusBadge>
          {promotion ? (
            <Link
              href={`/business/promotions/${promotion.id}/edit`}
              className="text-muted-foreground hover:text-foreground hover:underline"
            >
              Boosting: {promotion.values.title}
            </Link>
          ) : (
            <span className="text-muted-foreground">
              {CAMPAIGNS_COPY.noPromotion}
            </span>
          )}
        </div>
        <CampaignActions item={item} />
      </div>
    </div>
  );
}
