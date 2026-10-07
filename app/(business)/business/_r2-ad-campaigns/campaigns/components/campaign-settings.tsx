import { SectionCard } from "@/components/business/section-card";
import { formatMoney } from "@/lib/formatters/currency";

import { findPromotion } from "../../../promotions/constant/promotions.data";
import { formatDateRange } from "../../../promotions/utils/promotion.utils";
import {
  CAMPAIGNS_COPY,
  DESTINATION_OPTIONS,
  DETAIL_COPY,
  SCHEDULE_OPTIONS,
} from "../constant/campaign.constant";
import type { CampaignItem } from "../model/campaign.type";

const label = (options: { value: string; label: string }[], value: string) =>
  options.find((o) => o.value === value)?.label ?? value;

export function CampaignSettings({ item }: { item: CampaignItem }) {
  const rows = [
    [
      "Promotion",
      findPromotion(item.promotionId)?.values.title ??
        CAMPAIGNS_COPY.noPromotion,
    ],
    ["Price per click", formatMoney(item.cpcMinor)],
    [
      "Daily budget",
      item.dailyBudgetMinor === null
        ? DETAIL_COPY.noDailyLimit
        : formatMoney(item.dailyBudgetMinor),
    ],
    [
      "Dates",
      item.endDate || item.startDate
        ? formatDateRange(item)
        : DETAIL_COPY.noEndDate,
    ],
    ["Show on", label(SCHEDULE_OPTIONS, item.schedule)],
    ["Where", item.locations.join(", ") || DETAIL_COPY.everywhere],
    ["Interested in", item.interests.join(", ") || DETAIL_COPY.everyone],
    ["Clicks go to", label(DESTINATION_OPTIONS, item.destination)],
  ];

  return (
    <SectionCard title={DETAIL_COPY.settingsTitle}>
      <dl className="divide-y text-sm">
        {rows.map(([name, value]) => (
          <div key={name} className="flex justify-between gap-6 py-2.5">
            <dt className="text-muted-foreground">{name}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-muted-foreground">{DETAIL_COPY.budgetNote}</p>
    </SectionCard>
  );
}
