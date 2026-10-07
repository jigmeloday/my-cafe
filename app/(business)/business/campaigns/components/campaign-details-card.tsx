import { SectionCard } from "@/components/business/section-card";

import { findPromotion } from "../../promotions/constant/promotions.data";
import { EMAIL_COPY, EMAIL_STATUS } from "../constant/email-campaign.constant";
import type { EmailCampaignItem } from "../model/email-campaign.type";
import {
  estimateRecipients,
  formatSendAt,
} from "../utils/email-campaign.utils";

export function CampaignDetailsCard({ item }: { item: EmailCampaignItem }) {
  const rows = [
    ["Status", EMAIL_STATUS[item.status].label],
    ["Date", formatSendAt(item.sendAt)],
    ["Recipients", String(item.recipients || estimateRecipients(item))],
    ["Where", item.locations.join(", ") || "All followers"],
    ["Interested in", item.interests.join(", ") || "Everyone"],
    ["Birthday this month", item.birthdayThisMonth ? "Yes" : "No"],
    [
      "Featured promotion",
      findPromotion(item.promotionId)?.values.title ?? EMAIL_COPY.noPromotion,
    ],
  ];

  return (
    <SectionCard title="Details" description={EMAIL_COPY.consentNote}>
      <dl className="divide-y text-sm">
        {rows.map(([name, value]) => (
          <div key={name} className="flex justify-between gap-6 py-2.5">
            <dt className="text-muted-foreground">{name}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
