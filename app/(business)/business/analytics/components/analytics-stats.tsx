import { StatCard } from "@/components/business/stat-card";
import { formatNumber, formatPercent } from "@/lib/formatters/number";

import { ANALYTICS_COPY } from "../constant/analytics.constant";
import type { Totals } from "../model/analytics.type";
import { change, ctr } from "../utils/analytics.utils";

interface AnalyticsStatsProps {
  current: Totals;
  previous: Totals;
  /** Different people who viewed or clicked a promotion, now and in the period before. */
  reach: { current: number; previous: number };
}

export function AnalyticsStats({ current, previous, reach }: AnalyticsStatsProps) {
  const hint = ANALYTICS_COPY.vsPrevious;

  return (
    <section
      aria-label="Summary"
      className="grid grid-cols-2 gap-3 lg:grid-cols-4"
    >
      <StatCard
        label="Views"
        value={formatNumber(current.views)}
        delta={change(current.views, previous.views)}
        hint={hint}
      />
      <StatCard
        label={ANALYTICS_COPY.reachLabel}
        value={formatNumber(reach.current)}
        delta={change(reach.current, reach.previous)}
        hint={ANALYTICS_COPY.reachHint}
      />
      <StatCard
        label="Clicks"
        value={formatNumber(current.clicks)}
        delta={change(current.clicks, previous.clicks)}
        hint={hint}
      />
      <StatCard
        label="Click-through rate"
        value={formatPercent(ctr(current), 1)}
        delta={change(ctr(current), ctr(previous))}
        hint={hint}
      />
      <StatCard
        label="Saves"
        value={formatNumber(current.saves)}
        delta={change(current.saves, previous.saves)}
        hint={hint}
      />
      <StatCard
        label="Shares"
        value={formatNumber(current.shares)}
        delta={change(current.shares, previous.shares)}
        hint={hint}
      />
      <StatCard
        label="WhatsApp chats"
        value={formatNumber(current.chats)}
        delta={change(current.chats, previous.chats)}
        hint={hint}
      />
    </section>
  );
}
