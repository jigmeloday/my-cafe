import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { bannerService } from "@/services/banner/banner.service";

import { AdminBannersTable } from "./components/admin-banners-table";

export const metadata: Metadata = { title: "Banners — Nook admin" };

export default async function AdminBannersPage() {
  // The layout also checks this, but a page must not rely on that: it runs its own query.
  await requireRole("ADMIN");
  const banners = await bannerService.listAll();
  const create = (
    <Button render={<Link href="/admin/banners/new" />}>
      <Plus /> Create banner
    </Button>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>Banners</h1>
          <p className="text-sm text-muted-foreground">Every banner on the home page. You can make one for any business, and it is free.</p>
        </div>
        {banners.length > 0 && create}
      </header>
      {banners.length > 0 ? (
        <AdminBannersTable items={banners} />
      ) : (
        <EmptyState title="No banners yet" description="Create the first banner for a business." action={create} />
      )}
    </div>
  );
}
