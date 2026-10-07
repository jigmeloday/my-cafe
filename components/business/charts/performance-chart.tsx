"use client";

import { useState } from "react";
import { ChartColumn, Table2 } from "lucide-react";

import { FilterChips } from "@/components/shared/filter-chips";
import { Button } from "@/components/ui/button";

import { ChartLine } from "./chart-line";
import { ChartTable } from "./chart-table";
import { CHART_COPY } from "./constant/chart.constant";
import type { ChartMetric, ChartPoint } from "./model/chart.type";

interface PerformanceChartProps {
  title: string;
  points: ChartPoint[];
  metrics: ChartMetric[];
}

/** A line chart with a metric switcher and a table view. Works for any metrics you give it. */
export function PerformanceChart({
  title,
  points,
  metrics,
}: PerformanceChartProps) {
  const [metricId, setMetricId] = useState(metrics[0].id);
  const [asTable, setAsTable] = useState(false);
  const metric = metrics.find((m) => m.id === metricId) ?? metrics[0];

  return (
    <section
      aria-label={title}
      className="space-y-4 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2>{title}</h2>
        <Button variant="ghost" size="sm" onClick={() => setAsTable((v) => !v)}>
          {asTable ? <ChartColumn /> : <Table2 />}
          {asTable ? CHART_COPY.showChart : CHART_COPY.showTable}
        </Button>
      </div>
      {asTable ? (
        <ChartTable points={points} metrics={metrics} />
      ) : (
        <>
          {metrics.length > 1 && (
            <FilterChips
              options={metrics}
              active={metricId}
              onChange={setMetricId}
            />
          )}
          <ChartLine points={points} metric={metric} />
        </>
      )}
    </section>
  );
}
