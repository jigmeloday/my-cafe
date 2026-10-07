import Link from "next/link";

import { formatNumber } from "@/lib/formatters/number";

import { formatSendAt } from "../../campaigns/utils/email-campaign.utils";
import type { EmailCampaignItem } from "../../campaigns/model/email-campaign.type";
import { formatValue } from "@/components/business/charts/utils/chart.utils";
import { permille } from "../utils/email-analytics.utils";

const HEADERS = [
  "Campaign",
  "Sent",
  "Recipients",
  "Opened",
  "Clicked",
  "Unsubscribed",
];

export function EmailCampaignsTable({
  campaigns,
}: {
  campaigns: EmailCampaignItem[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-surface">
      <table className="w-full min-w-[40rem] text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            {HEADERS.map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 font-medium ${i >= 2 ? "text-right" : ""}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y tabular-nums">
          {campaigns.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <Link
                  href={`/business/campaigns/${c.id}`}
                  className="block font-medium hover:underline"
                >
                  {c.name}
                </Link>
                <p className="max-w-64 truncate text-xs text-muted-foreground">
                  {c.subject}
                </p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {formatSendAt(c.sendAt)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatNumber(c.recipients)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatValue(permille(c.opened, c.recipients), "permille")}
              </td>
              <td className="px-4 py-3 text-right">
                {formatValue(permille(c.clicked, c.recipients), "permille")}
              </td>
              <td className="px-4 py-3 text-right">
                {formatNumber(c.unsubscribed)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
