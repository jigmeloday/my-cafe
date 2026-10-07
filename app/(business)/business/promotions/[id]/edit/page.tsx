import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FormPageHeader } from "../../components/form-page-header";
import { PromotionForm } from "../../components/promotion-form";
import { PROMOTIONS_COPY } from "../../constant/promotion.constant";
import { findPromotion } from "../../constant/promotions.data";

export const metadata: Metadata = { title: "Edit promotion — kuzu business" };

export default async function EditPromotionPage({
  params,
}: PageProps<"/business/promotions/[id]/edit">) {
  const { id } = await params;
  const promotion = findPromotion(id);
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
      <PromotionForm initial={initial} />
    </div>
  );
}
