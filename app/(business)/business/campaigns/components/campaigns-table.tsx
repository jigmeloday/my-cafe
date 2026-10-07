import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";
import type { ActionResult } from "@/server/actions/action.type";

import { findPromotion } from "../../promotions/constant/promotions.data";
import { EMAIL_COPY, EMAIL_STATUS } from "../constant/email-campaign.constant";
import type { EmailCampaignItem } from "../model/email-campaign.type";
import {
  clickRate,
  formatRate,
  formatSendAt,
  openRate,
} from "../utils/email-campaign.utils";
import { CampaignRowActions } from "./campaign-row-actions";

const HEADERS = [
  "Campaign",
  "Status",
  "Recipients",
  "Date",
  "Opened",
  "Clicked",
  "",
];

interface CampaignsTableProps {
  items: EmailCampaignItem[];
  onResult: (result: ActionResult) => void;
}

export function CampaignsTable({ items, onResult }: CampaignsTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[50rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h || i}
                className={`px-4 py-3 font-medium ${i >= 2 && i !== 3 && i < 6 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {items.map((c) => {
            const { label, tone } = EMAIL_STATUS[c.status];
            const sent = c.status === "SENT";
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
                      EMAIL_COPY.noPromotion}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge tone={tone}>{label}</StatusBadge>
                </td>
                <td className="px-4 py-3 text-right">
                  {c.recipients ? formatNumber(c.recipients) : "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatSendAt(c.sendAt)}
                </td>
                <td className="px-4 py-3 text-right">
                  {sent ? formatRate(openRate(c)) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  {sent ? formatRate(clickRate(c)) : "—"}
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
