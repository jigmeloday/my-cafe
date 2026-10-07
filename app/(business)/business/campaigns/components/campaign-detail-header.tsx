import { StatusBadge } from "@/components/shared/status-badge";

import { EMAIL_STATUS } from "../constant/email-campaign.constant";
import type { EmailCampaignItem } from "../model/email-campaign.type";
import { formatSendAt } from "../utils/email-campaign.utils";
import { CampaignActions } from "./campaign-actions";
import { FormPageHeader } from "./form-page-header";

export function CampaignDetailHeader({ item }: { item: EmailCampaignItem }) {
  const { label, tone } = EMAIL_STATUS[item.status];

  return (
    <div className="space-y-3">
      <FormPageHeader title={item.name} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <StatusBadge tone={tone}>{label}</StatusBadge>
          {item.sendAt && (
            <span>
              {item.status === "SENT" ? "Sent" : "Goes out"}{" "}
              {formatSendAt(item.sendAt)}
            </span>
          )}
        </div>
        <CampaignActions item={item} />
      </div>
    </div>
  );
}
