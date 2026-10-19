import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { adminBusinessService } from "@/services/admin/admin-business.service";

import { BusinessesTable } from "./components/businesses-table";
import { BusinessesToolbar } from "./components/businesses-toolbar";
import { BUSINESSES_COPY } from "./constant/business.constant";
import { businessesHref, parseBusinessQuery } from "./utils/business-url.utils";

export const metadata: Metadata = { title: "Businesses — kuzu admin" };
export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage({ searchParams }: PageProps<"/admin/businesses">) {
  // The layout checks this too, but a page must not rely on that: it runs its own query.
  await requireRole("ADMIN");
  const query = parseBusinessQuery(await searchParams);
  const result = await adminBusinessService.list(query);

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1>{BUSINESSES_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{BUSINESSES_COPY.subtitle}</p>
      </header>
      <BusinessesToolbar query={query} counts={result.counts} />
      {result.items.length > 0 ? (
        <>
          <BusinessesTable items={result.items} />
          <PaginationBar
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            noun={result.total === 1 ? "business" : "businesses"}
            hrefFor={(page) => businessesHref({ ...query, page })}
          />
        </>
      ) : (
        <EmptyState
          title={BUSINESSES_COPY.emptyTitle}
          description={BUSINESSES_COPY.emptyDescription}
          action={
            <Button variant="secondary" nativeButton={false} render={<Link href={businessesHref({})} />}>
              Clear filters
            </Button>
          }
        />
      )}
    </div>
  );
}
