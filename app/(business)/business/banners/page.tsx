import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { requireRole } from "@/lib/session";
import { bannerService } from "@/services/banner/banner.service";

import { BannersTable } from "./components/banners-table";
import { BANNERS_COPY } from "./constant/banner.constant";

export const metadata: Metadata = { title: "Banners — Nook business" };

export default async function BannersPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const banners = await bannerService.list(user.id);
  const create = (
    <Button render={<Link href="/business/banners/new" />}>
      <Plus /> {BANNERS_COPY.create}
    </Button>
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-1">
          <h1>{BANNERS_COPY.title}</h1>
          <p className="text-sm text-muted-foreground">{BANNERS_COPY.subtitle}</p>
        </div>
        {banners.length > 0 && create}
      </header>
      {banners.length > 0 ? (
        <BannersTable items={banners} />
      ) : (
        <EmptyState title={BANNERS_COPY.emptyTitle} description={BANNERS_COPY.emptyDescription} action={create} />
      )}
    </div>
  );
}
