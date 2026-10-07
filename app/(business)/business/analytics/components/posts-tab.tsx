import { BarChart } from "@/components/business/charts/bar-chart";
import { BreakdownList } from "@/components/business/charts/breakdown-list";
import { SectionCard } from "@/components/business/section-card";

import { ANALYTICS_COPY } from "../constant/analytics.constant";
import type { Dataset, RangeDays } from "../model/analytics.type";
import { promotionRows, rangeTotals } from "../utils/dataset.utils";
import { PROMOTION_METAS } from "../utils/promotion-meta.utils";
import { PostTrend } from "./post-trend";
import { PromotionsTable } from "./promotions-table";

const BAR_LIMIT = 6;

export function PostsTab({ data, range }: { data: Dataset; range: RangeDays }) {
  const rows = promotionRows(data, range, PROMOTION_METAS);
  const byType = new Map<string, number>();
  rows.forEach((r) => byType.set(r.type, (byType.get(r.type) ?? 0) + r.clicks));
  const typeRows = [...byType.entries()]
    .map(([label, value]) => ({ id: label, label, value }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4">
      <SectionCard
        title={ANALYTICS_COPY.postsBarsTitle}
        description={ANALYTICS_COPY.postsHint}
      >
        <BarChart
          label={ANALYTICS_COPY.postsBarsTitle}
          kind="number"
          items={rows
            .slice(0, BAR_LIMIT)
            .map((r) => ({ id: r.id, label: r.title, value: r.clicks }))}
        />
      </SectionCard>
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <PostTrend data={data} range={range} rows={rows} />
        <SectionCard title={ANALYTICS_COPY.typesTitle}>
          <BreakdownList rows={typeRows} />
        </SectionCard>
      </div>
      <section aria-labelledby="all-posts" className="space-y-3">
        <h2 id="all-posts">{ANALYTICS_COPY.postsTableTitle}</h2>
        <PromotionsTable
          rows={rows}
          totalClicks={rangeTotals(data, range).clicks}
        />
      </section>
    </div>
  );
}
