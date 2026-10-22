import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { requireRole } from "@/lib/session";
import { bannerService } from "@/services/banner/banner.service";
import { getOwnBusiness } from "@/services/business/own-business";
import { walletService } from "@/services/wallet/wallet.service";

import { BannerEditForm } from "../../components/banner-edit-form";
import { BANNERS_COPY } from "../../constant/banner.constant";

export const metadata: Metadata = { title: "Edit banner — Nook business" };

export default async function EditBannerPage({ params }: PageProps<"/business/banners/[id]/edit">) {
  const { id } = await params;
  const user = await requireRole("BUSINESS_OWNER");
  const [banner, balance, own] = await Promise.all([bannerService.get(user.id, id), walletService.balanceFor(user), getOwnBusiness()]);
  if (!banner) notFound();
  // An ended or removed banner can't be changed: the list explains why.
  if (banner.removed || banner.status === "ended") redirect("/business/banners");

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/business/banners" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> {BANNERS_COPY.back}
        </Link>
        <div className="space-y-1">
          <h1>{BANNERS_COPY.editTitle}</h1>
          <p className="text-sm text-muted-foreground">{BANNERS_COPY.editSubtitle}</p>
        </div>
      </header>
      <BannerEditForm banner={banner} businessName={own?.name ?? user.name} balance={balance} />
    </div>
  );
}
