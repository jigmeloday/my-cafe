import type { Metadata } from "next";

import { requireRole } from "@/lib/session";
import { walletService } from "@/services/wallet/wallet.service";
import { featuredService } from "@/services/featured/featured.service";
import { categoryService } from "@/services/category/category.service";

import { FormPageHeader } from "../components/form-page-header";
import { PromotionForm } from "../components/promotion-form";
import { NEW_PROMOTION, PROMOTIONS_COPY } from "../constant/promotion.constant";

export const metadata: Metadata = { title: "New promotion — Nook business" };

export default async function NewPromotionPage() {
  const user = await requireRole("BUSINESS_OWNER");
  const balance = await walletService.balanceFor(user);
  const [categories, availability] = await Promise.all([categoryService.options(), featuredService.availability()]);

  return (
    <div className="space-y-6">
      <FormPageHeader
        title={PROMOTIONS_COPY.newTitle}
        subtitle={PROMOTIONS_COPY.newSubtitle}
      />
      <PromotionForm initial={NEW_PROMOTION} categories={categories} balance={balance} availability={availability} />
    </div>
  );
}
