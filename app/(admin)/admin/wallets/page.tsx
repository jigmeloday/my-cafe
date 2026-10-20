import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/shared/empty-state";
import { PaginationBar } from "@/components/shared/pagination-bar";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { adminWalletService } from "@/services/admin/admin-wallet.service";

import { WalletsTable } from "./components/wallets-table";
import { WalletsToolbar } from "./components/wallets-toolbar";
import { WALLETS_COPY } from "./constant/wallet.constant";
import { parseWalletQuery, walletsHref } from "./utils/wallet-url.utils";

export const metadata: Metadata = { title: "Wallets — Nook admin" };

export default async function AdminWalletsPage({ searchParams }: PageProps<"/admin/wallets">) {
  // The layout also checks this, but a page must not rely on that: it runs its own query.
  await requireRole("ADMIN");
  const query = parseWalletQuery(await searchParams);
  const result = await adminWalletService.list(query);

  return (
    <div className="space-y-6">
      <header className="max-w-2xl space-y-1">
        <h1>{WALLETS_COPY.title}</h1>
        <p className="text-sm text-muted-foreground">{WALLETS_COPY.subtitle}</p>
      </header>
      <WalletsToolbar q={query.q} />
      {result.items.length > 0 ? (
        <>
          <WalletsTable items={result.items} />
          <PaginationBar
            page={result.page}
            totalPages={result.totalPages}
            total={result.total}
            pageSize={result.pageSize}
            noun={result.total === 1 ? "business" : "businesses"}
            hrefFor={(page) => walletsHref({ ...query, page })}
          />
        </>
      ) : (
        <EmptyState
          title={WALLETS_COPY.emptyTitle}
          description={WALLETS_COPY.emptyDescription}
          action={
            query.q ? (
              <Button variant="secondary" nativeButton={false} render={<Link href={walletsHref({})} />}>
                Clear search
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
