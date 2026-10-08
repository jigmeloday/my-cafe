"use client";

import { useState } from "react";

import { EmptyState } from "@/components/shared/empty-state";
import { FormMessage } from "@/components/shared/form-message";
import { ListToolbar } from "@/components/shared/list-toolbar";
import { Button } from "@/components/ui/button";
import type { ActionResult } from "@/server/actions/action.type";

import {
  DEFAULT_FILTERS,
  FILTERS,
  USERS_COPY,
} from "../constant/user.constant";
import { ADMIN_USERS } from "../constant/users.data";
import type { UserFilter, UserFilters } from "../model/user.type";
import { countFor, filterUsers } from "../utils/user.utils";
import { UsersTable } from "./users-table";

export function UsersExplorer() {
  const [filters, setFilters] = useState<UserFilters>(DEFAULT_FILTERS);
  const [notice, setNotice] = useState<ActionResult | null>(null);
  const items = filterUsers(ADMIN_USERS, filters);

  return (
    <div className="space-y-4">
      <ListToolbar
        query={filters.query}
        onQueryChange={(query) => setFilters({ ...filters, query })}
        placeholder={USERS_COPY.searchPlaceholder}
        filters={FILTERS.map((f) => ({
          ...f,
          count: countFor(ADMIN_USERS, f.id),
        }))}
        active={filters.filter}
        onActiveChange={(filter) =>
          setFilters({ ...filters, filter: filter as UserFilter })
        }
      />
      {notice && !notice.ok && (
        <FormMessage tone="error">{notice.error}</FormMessage>
      )}
      {items.length > 0 ? (
        <UsersTable items={items} onResult={setNotice} />
      ) : (
        <EmptyState
          title={USERS_COPY.emptyTitle}
          description={USERS_COPY.emptyDescription}
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
