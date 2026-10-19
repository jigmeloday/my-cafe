import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireRole } from "@/lib/session";
import { promotionService } from "@/services/promotion/promotion.service";
import { walletService } from "@/services/wallet/wallet.service";
import { featuredService } from "@/services/featured/featured.service";
import { categoryService } from "@/services/category/category.service";

import { FormPageHeader } from "../../components/form-page-header";
import { PromotionForm } from "../../components/promotion-form";
import { PROMOTIONS_COPY } from "../../constant/promotion.constant";

export const metadata: Metadata = { title: "Edit promotion — kuzu business" };

export default async function EditPromotionPage({
  params,
}: PageProps<"/business/promotions/[id]/edit">) {
  const { id } = await params;
  const user = await requireRole("BUSINESS_OWNER");
  const balance = await walletService.balanceFor(user);
  const promotion = await promotionService.get(user.id, id);
  if (!promotion) notFound();

  const initial = {
    ...promotion.values,
    status: promotion.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
  } as const;

  return (
    <div className="space-y-6">
      <FormPageHeader
        title={PROMOTIONS_COPY.editTitle}
        subtitle={PROMOTIONS_COPY.editSubtitle}
      />
      <PromotionForm id={id} balance={balance} initial={initial} categories={await categoryService.options()} availability={await featuredService.availability()} bookings={await featuredService.forPromotion(user.id, id)} />
    </div>
  );
}
