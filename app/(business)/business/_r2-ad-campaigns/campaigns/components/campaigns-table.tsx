import Link from "next/link";

import { CAMPAIGN_STATUS } from "@/components/business/constant/status.constant";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber, formatPercent } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";

import { budgetUsed, campaignCtr } from "../../dashboard/utils/dashboard.utils";
import { findPromotion } from "../../../promotions/constant/promotions.data";
import { CAMPAIGNS_COPY } from "../constant/campaign.constant";
import type { CampaignItem } from "../model/campaign.type";
import { CampaignRowActions } from "./campaign-row-actions";

const HEADERS = [
  "Campaign",
  "Status",
  "Budget used",
  "Clicks",
  "CTR",
  "CPC",
  "",
];

interface CampaignsTableProps {
  items: CampaignItem[];
  onResult: (result: ActionResult) => void;
}

export function CampaignsTable({ items, onResult }: CampaignsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[48rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h || i}
                className={`px-4 py-3 font-medium ${i >= 3 && i <= 5 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((c) => {
            const { label, tone } = CAMPAIGN_STATUS[c.status];
            const used = budgetUsed(c);
            return (
              <tr key={c.id}>
                <td className="px-4 py-3">
                  <Link
                    href={`/business/campaigns/${c.id}`}
                    className="block font-medium hover:underline"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {findPromotion(c.promotionId)?.values.title ??
                      CAMPAIGNS_COPY.noPromotion}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                </td>
                <td className="px-4 py-3">
                  <div
                    className="h-1.5 w-28 overflow-hidden rounded-full bg-muted"
                    role="progressbar"
                    aria-valuenow={Math.round(used * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${c.name} budget used`}
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${used * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatMoney(c.spentMinor)} of {formatMoney(c.budgetMinor)}
                  </p>
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(c.clicks)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatPercent(campaignCtr(c))}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatMoney(c.cpcMinor)}
                </td>
                <td className="px-4 py-3 text-right">
                  <CampaignRowActions item={c} onResult={onResult} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
