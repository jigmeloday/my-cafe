"use client";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { GalleryUpload } from "@/components/shared/gallery-upload";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/validations/promotion.schema";
import { savePromotionAction } from "@/server/actions/promotion.actions";

import {
  MAX_PHOTOS,
  PROMOTE_COPY,
  PROMOTIONS_COPY,
} from "../constant/promotion.constant";
import { CtaFields } from "./cta-fields";
import { DetailsFields } from "./details-fields";
import { PromoteFields } from "./promote-fields";
import { PromotionPreview } from "./promotion-preview";
import { ScheduleFields } from "./schedule-fields";

export function PromotionForm({ initial }: { initial: PromotionInput }) {
  const { form, submit, result, pending } = useActionForm(
    promotionSchema,
    savePromotionAction,
    initial,
  );
  const setStatus = (status: PromotionInput["status"]) => () =>
    form.setValue("status", status);

  return (
    <form
      onSubmit={submit}
      noValidate
      className="grid gap-6 lg:grid-cols-[1fr_16rem]"
    >
      <div className="min-w-0 space-y-4">
        {result && !result.ok && (
          <FormMessage tone="error">{result.error}</FormMessage>
        )}
        <SectionCard title="Details">
          <DetailsFields form={form} />
        </SectionCard>
        <SectionCard title="When & where">
          <ScheduleFields form={form} />
        </SectionCard>
        <SectionCard title="Photos" description={PROMOTIONS_COPY.photosHint}>
          <GalleryUpload label="Photos" max={MAX_PHOTOS} />
        </SectionCard>
        <SectionCard
          title="Call to action"
          description="The button people see on your promotion."
        >
          <CtaFields form={form} />
        </SectionCard>
        <SectionCard
          title={PROMOTE_COPY.title}
          description={PROMOTE_COPY.description}
        >
          <PromoteFields form={form} />
        </SectionCard>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            variant="secondary"
            disabled={pending}
            onClick={setStatus("DRAFT")}
          >
            {PROMOTIONS_COPY.saveDraft}
          </Button>
          <Button
            type="submit"
            disabled={pending}
            onClick={setStatus("PUBLISHED")}
          >
            {pending ? "Saving…" : PROMOTIONS_COPY.publish}
          </Button>
        </div>
      </div>
      <PromotionPreview control={form.control} />
    </form>
  );
}
