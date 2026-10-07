import type { Metadata } from "next";

import { FormPageHeader } from "../components/form-page-header";
import { PromotionForm } from "../components/promotion-form";
import { NEW_PROMOTION, PROMOTIONS_COPY } from "../constant/promotion.constant";

export const metadata: Metadata = { title: "New promotion — kuzu business" };

export default function NewPromotionPage() {
  return (
    <div className="space-y-6">
      <FormPageHeader
        title={PROMOTIONS_COPY.newTitle}
        subtitle={PROMOTIONS_COPY.newSubtitle}
      />
      <PromotionForm initial={NEW_PROMOTION} />
    </div>
  );
}
