import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { PerformanceChart } from "@/components/business/charts/performance-chart";
import { SectionCard } from "@/components/business/section-card";
import { StatCard } from "@/components/business/stat-card";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import { ANALYTICS_COPY, PROFILE_METRICS } from "../constant/analytics.constant";
import type { ProfileData, RangeDays } from "../model/analytics.type";
import { change } from "../utils/analytics.utils";
import { clickRows, previousProfileTotals, profilePoints, profileTotals, visitSourceRows } from "../utils/profile.utils";

interface ProfileTabProps {
  profile: ProfileData;
  range: RangeDays;
}

/** Visits to the business's own page, and which contact links people clicked. */
export function ProfileTab({ profile, range }: ProfileTabProps) {
  const now = profileTotals(profile, range);
  const before = previousProfileTotals(profile, range);
  const rate = now.visits === 0 ? 0 : now.clicks / now.visits;
  const rateBefore = before.visits === 0 ? 0 : before.clicks / before.visits;
  const clicks = clickRows(profile, range);
  const hint = ANALYTICS_COPY.vsPrevious;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{ANALYTICS_COPY.profileHint}</p>
      <section aria-label="Page summary" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Page visits" value={formatNumber(now.visits)} delta={change(now.visits, before.visits)} hint={hint} />
        <StatCard label="Visitors" value={formatNumber(now.visitors)} delta={change(now.visitors, before.visitors)} hint={hint} />
        <StatCard label="Link clicks" value={formatNumber(now.clicks)} delta={change(now.clicks, before.clicks)} hint={hint} />
        <StatCard label="Shares" value={formatNumber(now.shares)} delta={change(now.shares, before.shares)} hint={hint} />
        <StatCard label="Clicks per visit" value={formatPercent(rate, 1)} delta={change(rate, rateBefore)} hint={hint} />
      </section>
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <PerformanceChart title={ANALYTICS_COPY.profileChartTitle} points={profilePoints(profile, range)} metrics={PROFILE_METRICS} />
        <div className="space-y-4">
          <SectionCard title={ANALYTICS_COPY.profileClicksTitle}>
            {clicks.length > 0 ? <BreakdownList rows={clicks} /> : <p className="text-sm text-muted-foreground">{ANALYTICS_COPY.noProfileClicks}</p>}
          </SectionCard>
          <SectionCard title={ANALYTICS_COPY.profileSourcesTitle}>
            <BreakdownList rows={visitSourceRows(profile, range)} />
          </SectionCard>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{ANALYTICS_COPY.visitorsNote}</p>
    </div>
  );
}
