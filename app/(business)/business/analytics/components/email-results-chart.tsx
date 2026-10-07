"use client";

import { useState } from "react";

import { BarChart } from "@/components/business/charts/bar-chart";
import { SectionCard } from "@/components/business/section-card";
import { FilterChips } from "@/components/shared/filter-chips";

import type { EmailCampaignItem } from "../../campaigns/model/email-campaign.type";
import { ANALYTICS_COPY, EMAIL_METRICS } from "../constant/analytics.constant";
import { emailBars } from "../utils/email-analytics.utils";

export function EmailResultsChart({
  campaigns,
}: {
  campaigns: EmailCampaignItem[];
}) {
  const [metricId, setMetricId] = useState(EMAIL_METRICS[0].id);
  const metric =
    EMAIL_METRICS.find((m) => m.id === metricId) ?? EMAIL_METRICS[0];

  return (
    <SectionCard title={ANALYTICS_COPY.emailChartTitle}>
      <FilterChips
        options={EMAIL_METRICS}
        active={metricId}
        onChange={setMetricId}
      />
      <BarChart
        label={`${metric.label} per campaign`}
        kind={metric.kind}
        items={emailBars(campaigns, metricId)}
      />
    </SectionCard>
  );
}
