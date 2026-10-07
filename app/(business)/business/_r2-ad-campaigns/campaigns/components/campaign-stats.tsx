import { StatCard } from "@/components/business/stat-card";
import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import { budgetUsed, campaignCtr } from "../../dashboard/utils/dashboard.utils";
import type { CampaignItem } from "../model/campaign.type";

export function CampaignStats({ item }: { item: CampaignItem }) {
  const remaining = item.budgetMinor - item.spentMinor;
  const avgCpc = item.clicks
    ? Math.round(item.spentMinor / item.clicks)
    : item.cpcMinor;

  return (
    <section
      aria-label="Summary"
      className="grid grid-cols-2 gap-3 lg:grid-cols-5"
    >
      <StatCard
        label="Spent"
        value={formatMoney(item.spentMinor)}
        hint={`${Math.round(budgetUsed(item) * 100)}% of budget`}
      />
      <StatCard
        label="Remaining"
        value={formatMoney(remaining)}
        hint={`of ${formatMoney(item.budgetMinor)}`}
      />
      <StatCard label="Clicks" value={formatNumber(item.clicks)} />
      <StatCard
        label="Click-through rate"
        value={formatPercent(campaignCtr(item))}
        hint={`${formatNumber(item.impressions)} impressions`}
      />
      <StatCard
        label="Avg. cost per click"
        value={formatMoney(avgCpc)}
        hint={`bid ${formatMoney(item.cpcMinor)}`}
      />
    </section>
  );
}
