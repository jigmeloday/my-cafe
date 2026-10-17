"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/server/actions/action.type";

import {
  BUSINESSES_COPY,
  DEFAULT_FILTERS,
  STATUS_FILTERS,
} from "../constant/business.constant";
import { ADMIN_BUSINESSES } from "../constant/businesses.data";
import type { BusinessFilters } from "../model/business.type";
import { countByStatus, filterBusinesses } from "../utils/business.utils";
import { BusinessesTable } from "./businesses-table";

export function BusinessesExplorer() {
  const [filters, setFilters] = useState<BusinessFilters>(DEFAULT_FILTERS);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterBusinesses(ADMIN_BUSINESSES, filters);

  return (
    <div className="space-y-4">
      <ListToolbar
        query={filters.query}
        onQueryChange={(query) => setFilters({ ...filters, query })}
        placeholder={BUSINESSES_COPY.searchPlaceholder}
        filters={STATUS_FILTERS.map((f) => ({
          ...f,
          count: countByStatus(
            ADMIN_BUSINESSES,
            f.id as BusinessFilters["status"],
          ),
        }))}
        active={filters.status}
        onActiveChange={(status) =>
          setFilters({
            ...filters,
            status: status as BusinessFilters["status"],
          })
        }
      />
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      {items.length > 0 ? (
        <BusinessesTable items={items} onResult={setNotice} />
      ) : (
        <EmptyState
          title={BUSINESSES_COPY.emptyTitle}
          description={BUSINESSES_COPY.emptyDescription}
          action={
            <Button
              variant="secondary"
              onClick={() => setFilters(DEFAULT_FILTERS)}
            >
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
