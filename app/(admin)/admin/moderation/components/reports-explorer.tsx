"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { ListToolbar } from "@/components/shared/list-toolbar";
import type { ActionResult } from "@/server/actions/action.type";

import {
  DEFAULT_FILTER,
  FILTERS,
  MODERATION_COPY,
} from "../constant/report.constant";
import { REPORTS } from "../constant/reports.data";
import type { ReportFilter } from "../model/report.type";
import { countFor, filterReports } from "../utils/report.utils";
import { ReportCard } from "./report-card";

export function ReportsExplorer() {
  const [filter, setFilter] = useState<ReportFilter>(DEFAULT_FILTER);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterReports(REPORTS, filter, query);

  return (
    <div className="space-y-4">
      <ListToolbar
        query={query}
        onQueryChange={setQuery}
        placeholder={MODERATION_COPY.searchPlaceholder}
        filters={FILTERS.map((f) => ({ ...f, count: countFor(REPORTS, f.id) }))}
        active={filter}
        onActiveChange={(id) => setFilter(id as ReportFilter)}
      />
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      {items.length > 0 ? (
        <ul className="grid gap-3 lg:grid-cols-2">
          {items.map((report) => (
            <ReportCard key={report.id} report={report} onResult={setNotice} />
          ))}
        </ul>
      ) : (
        <EmptyState
          title={MODERATION_COPY.emptyTitle}
          description={MODERATION_COPY.emptyDescription}
        />
      )}
    </div>
  );
}
