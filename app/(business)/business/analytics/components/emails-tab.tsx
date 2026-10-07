import { FunnelChart } from "@/components/business/charts/funnel-chart";
import { formatValue } from "@/components/business/charts/utils/chart.utils";
import { SectionCard } from "@/components/business/section-card";
import { StatCard } from "@/components/business/stat-card";
import { formatNumber } from "@/lib/formatters/number";

import { ANALYTICS_COPY } from "../constant/analytics.constant";
import {
  emailFunnel,
  emailTotals,
  permille,
  sentCampaigns,
} from "../utils/email-analytics.utils";
import { EmailCampaignsTable } from "./email-campaigns-table";
import { EmailResultsChart } from "./email-results-chart";

export function EmailsTab() {
  const campaigns = sentCampaigns();
  if (campaigns.length === 0) {
    return (
      <p className="rounded-xl border bg-surface p-4 text-sm text-muted-foreground">
        {ANALYTICS_COPY.noEmails}
      </p>
    );
  }
  const totals = emailTotals(campaigns);

  return (
    <div className="space-y-4">
      <section
        aria-label="Email summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <StatCard
          label="Campaigns sent"
          value={formatNumber(totals.campaigns)}
          hint="all time"
        />
        <StatCard
          label="Open rate"
          value={formatValue(
            permille(totals.opened, totals.recipients),
            "permille",
          )}
          hint={`${formatNumber(totals.opened)} opens`}
        />
        <StatCard
          label="Click rate"
          value={formatValue(
            permille(totals.clicked, totals.recipients),
            "permille",
          )}
          hint={`${formatNumber(totals.clicked)} clicks`}
        />
        <StatCard
          label="Unsubscribed"
          value={formatNumber(totals.unsubscribed)}
          hint={`of ${formatNumber(totals.recipients)} emails`}
        />
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <EmailResultsChart campaigns={campaigns} />
        <SectionCard title={ANALYTICS_COPY.emailFunnelTitle}>
          <FunnelChart
            label={ANALYTICS_COPY.emailFunnelTitle}
            stages={emailFunnel(campaigns)}
          />
        </SectionCard>
      </div>
      <section aria-labelledby="email-table" className="space-y-3">
        <h2 id="email-table">{ANALYTICS_COPY.emailTableTitle}</h2>
        <EmailCampaignsTable campaigns={[...campaigns].reverse()} />
      </section>
    </div>
  );
}
