"use client";

import { useState } from "react";

import { PerformanceChart } from "@/components/business/charts/performance-chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ANALYTICS_COPY, METRICS } from "../constant/analytics.constant";
import type {
  Dataset,
  PromotionStatsRow,
  RangeDays,
} from "../model/analytics.type";
import { promotionPoints } from "../utils/dataset.utils";

interface PostTrendProps {
  data: Dataset;
  range: RangeDays;
  /** Posts to choose from, best first. */
  rows: PromotionStatsRow[];
}

/** Daily views, clicks and saves for one post, chosen from a dropdown. */
export function PostTrend({ data, range, rows }: PostTrendProps) {
  const [id, setId] = useState(rows[0]?.id ?? "");
  const options = rows.map((r) => ({ value: r.id, label: r.title }));
  const chosen = rows.some((r) => r.id === id) ? id : rows[0]?.id;

  if (!chosen) return null;

  return (
    <div className="space-y-3">
      <Select
        items={options}
        value={chosen}
        onValueChange={(next) => setId(next ?? chosen)}
      >
        <SelectTrigger aria-label="Choose a post" className="w-full sm:w-72">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <PerformanceChart
        title={ANALYTICS_COPY.postsTrendTitle}
        points={promotionPoints(data, chosen, range)}
        metrics={METRICS}
      />
    </div>
  );
}
