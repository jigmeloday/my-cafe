import Link from "next/link";

import { CAMPAIGN_STATUS } from "@/components/business/constant/status.constant";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatMoney } from "@/lib/formatters/currency";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import { DASHBOARD_COPY } from "../constant/dashboard.constant";
import { CAMPAIGNS } from "../constant/dashboard.data";
import { budgetUsed, campaignCtr } from "../utils/dashboard.utils";

const HEADERS = ["Campaign", "Status", "Budget used", "Clicks", "CTR", "CPC"];

export function CampaignsTable() {
  return (
    <section
      aria-labelledby="campaigns"
      className="space-y-3 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <h2 id="campaigns">{DASHBOARD_COPY.campaignsTitle}</h2>
        <Link
          href="/business/campaigns"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {DASHBOARD_COPY.viewAll}
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[40rem] text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              {HEADERS.map((h, i) => (
                <th
                  key={h}
                  className={`py-2 font-medium ${i > 2 ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y tabular-nums">
            {CAMPAIGNS.map((c) => {
              const { label, tone } = CAMPAIGN_STATUS[c.status];
              const used = budgetUsed(c);
              return (
                <tr key={c.id}>
                  <td className="py-3 pr-4">
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.promotion}
                    </p>
                  </td>
                  <td className="py-3 pr-4">
                    <StatusBadge tone={tone}>{label}</StatusBadge>
                  </td>
                  <td className="py-3 pr-4">
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
                      {formatMoney(c.spentMinor)} of{" "}
                      {formatMoney(c.budgetMinor)}
                    </p>
                  </td>
                  <td className="py-3 text-right">{formatNumber(c.clicks)}</td>
                  <td className="py-3 text-right">
                    {formatPercent(campaignCtr(c))}
                  </td>
                  <td className="py-3 text-right">{formatMoney(c.cpcMinor)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
