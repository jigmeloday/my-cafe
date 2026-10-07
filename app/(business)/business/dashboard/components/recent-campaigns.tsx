import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { formatNumber } from "@/lib/formatters/number";

import { EMAIL_STATUS } from "../../campaigns/constant/email-campaign.constant";
import { EMAIL_CAMPAIGNS } from "../../campaigns/constant/email-campaigns.data";
import {
  formatRate,
  formatSendAt,
  openRate,
} from "../../campaigns/utils/email-campaign.utils";
import { DASHBOARD_COPY, RECENT_LIMIT } from "../constant/dashboard.constant";

export function RecentCampaigns() {
  const items = EMAIL_CAMPAIGNS.slice(0, RECENT_LIMIT);

  return (
    <section
      aria-labelledby="recent-campaigns"
      className="space-y-3 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex items-center justify-between">
        <h2 id="recent-campaigns">{DASHBOARD_COPY.campaignsTitle}</h2>
        <Link
          href="/business/campaigns"
          className="text-sm font-semibold text-primary hover:underline"
        >
          {DASHBOARD_COPY.viewAll}
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {DASHBOARD_COPY.campaignsEmpty}
        </p>
      ) : (
        <ul className="divide-y">
          {items.map((c) => {
            const { label, tone } = EMAIL_STATUS[c.status];
            return (
              <li key={c.id} className="flex items-center gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/business/campaigns/${c.id}`}
                    className="block truncate text-sm font-medium hover:underline"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {formatSendAt(c.sendAt)}
                    {c.status === "SENT" &&
                      ` · ${formatNumber(c.recipients)} sent · ${formatRate(openRate(c))} opened`}
                  </p>
                </div>
                <StatusBadge tone={tone}>{label}</StatusBadge>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
