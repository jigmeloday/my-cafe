"use client";

import { useState } from "react";
import { ChartColumn, Table2 } from "lucide-react";

import { FilterChips } from "@/components/shared/filter-chips";
import { Button } from "@/components/ui/button";

import { DASHBOARD_COPY, METRIC_OPTIONS } from "../constant/dashboard.constant";
import { DAILY_POINTS } from "../constant/dashboard.data";
import type { MetricId } from "../model/dashboard.type";
import { ChartLine } from "./chart-line";
import { ChartTable } from "./chart-table";

export function PerformanceChart() {
  const [metric, setMetric] = useState<MetricId>("clicks");
  const [asTable, setAsTable] = useState(false);

  return (
    <section
      aria-labelledby="performance"
      className="space-y-4 rounded-xl border bg-surface p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="performance">{DASHBOARD_COPY.chartTitle}</h2>
        <Button variant="ghost" size="sm" onClick={() => setAsTable((v) => !v)}>
          {asTable ? <ChartColumn /> : <Table2 />}
          {asTable ? DASHBOARD_COPY.showChart : DASHBOARD_COPY.showTable}
        </Button>
      </div>
      {asTable ? (
        <ChartTable points={DAILY_POINTS} />
      ) : (
        <>
          <FilterChips
            options={METRIC_OPTIONS}
            active={metric}
            onChange={setMetric}
          />
          <ChartLine points={DAILY_POINTS} metric={metric} />
        </>
      )}
    </section>
  );
}
