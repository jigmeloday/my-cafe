import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { requireRole } from "@/lib/session";
import { getOwnBusiness } from "@/services/business/own-business";
import { promotionService } from "@/services/promotion/promotion.service";
import { walletService } from "@/services/wallet/wallet.service";

import { BannerForm } from "../components/banner-form";
import { BANNERS_COPY } from "../constant/banner.constant";

export const metadata: Metadata = { title: "Create a banner — Nook business" };

export default async function NewBannerPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const [balance, own, promotions] = await Promise.all([walletService.balanceFor(user), getOwnBusiness(), promotionService.list(user.id)]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <Link href="/business/banners" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" /> {BANNERS_COPY.back}
        </Link>
        <div className="space-y-1">
          <h1>{BANNERS_COPY.newTitle}</h1>
          <p className="text-sm text-muted-foreground">{BANNERS_COPY.newSubtitle}</p>
        </div>
      </header>
      <BannerForm
        businessName={own?.name ?? user.name}
        balance={balance}
        promotions={promotions.filter((p) => p.status === "PUBLISHED").map((p) => ({ value: p.id, label: p.values.title }))}
      />
    </div>
  );
}
