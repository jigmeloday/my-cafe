import { StatCard } from "@/components/business/stat-card";
import { formatNumber } from "@/lib/formatters/number";

import { EMAIL_COPY } from "../constant/email-campaign.constant";
import type { EmailCampaignItem } from "../model/email-campaign.type";
import { clickRate, formatRate, openRate } from "../utils/email-campaign.utils";

export function CampaignStats({ item }: { item: EmailCampaignItem }) {
  if (item.status !== "SENT") {
    return (
      <p className="rounded-xl border bg-surface p-4 text-sm text-muted-foreground">
        {EMAIL_COPY.statsAfterSend}
      </p>
    );
  }

  return (
    <section
      aria-label="Results"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <StatCard
        label="Sent to"
        value={formatNumber(item.recipients)}
        hint="followers"
      />
      <StatCard
        label="Opened"
        value={formatRate(openRate(item))}
        hint={`${formatNumber(item.opened)} people`}
      />
      <StatCard
        label="Clicked"
        value={formatRate(clickRate(item))}
        hint={`${formatNumber(item.clicked)} people`}
      />
      <StatCard label="Unsubscribed" value={formatNumber(item.unsubscribed)} />
    </section>
  );
}
