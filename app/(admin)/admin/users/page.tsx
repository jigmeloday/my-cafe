import type { Metadata } from "next";

import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { adminUserService } from "@/services/admin/admin-user.service";
import Link from "next/link";

import { UsersTable } from "./components/users-table";
import { UsersToolbar } from "./components/users-toolbar";
import { USERS_COPY } from "./constant/user.constant";
import { parseUserQuery, usersHref } from "./utils/user-url.utils";

export const metadata: Metadata = { title: "Users — kuzu admin" };

export default async function AdminUsersPage({ searchParams }: PageProps<"/admin/users">) {
  // The layout also checks this, but a page must not rely on that: it runs its own query.
  const admin = await requireRole("ADMIN");

  const query = parseUserQuery(await searchParams);
  const result = await adminUserService.list(query);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{USERS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{USERS_COPY.subtitle}</p>
      </header>
      <UsersToolbar query={query} counts={result.counts} />
      {result.items.length > 0 ? (
        <>
          <UsersTable items={result.items} currentUserId={admin.id} />
          <PaginationBar
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            noun={result.total === 1 ? "user" : "users"}
            hrefFor={(page) => usersHref({ ...query, page })}
          />
        </>
      ) : (
        <EmptyState
          title={USERS_COPY.emptyTitle}
          description={USERS_COPY.emptyDescription}
          action={
            <Button variant="secondary" nativeButton={false} render={<Link href={usersHref({})} />}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
