"use client";

import { useEffect } from "react";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { GalleryUpload } from "@/components/shared/gallery-upload";
import { Button } from "@/components/ui/button";
import { COIN_COSTS } from "@/lib/coins";
import { mediaUrl } from "@/lib/media";
import { uploadBusinessImage } from "@/lib/upload-client";
import { scrollToFirstProblem } from "@/lib/scroll";
import { useActionForm } from "@/hooks/use-action-form";
import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/validations/promotion.schema";
import { savePromotionAction } from "@/server/actions/promotion.actions";

import {
  MAX_PHOTOS,
  PUBLISH_COPY,
  PROMOTIONS_COPY,
} from "../constant/promotion.constant";
import type { OptionItem } from "../model/promotion.type";
import { CtaFields } from "./cta-fields";
import { DetailsFields } from "./details-fields";
import { PromotionPreview } from "./promotion-preview";
import { PublishCost } from "./publish-cost";
import { ScheduleFields } from "./schedule-fields";

interface PromotionFormProps {
  initial: PromotionInput;
  categories: OptionItem[];
  /** Set when editing an existing promotion. */
  id?: string;
  /** Coins in the business wallet. */
  balance: number;
}

export function PromotionForm({ initial, categories, id, balance }: PromotionFormProps) {
  // Going live costs coins once; changing something already live is free.
  const publishFee = id && initial.status === "PUBLISHED" ? 0 : COIN_COSTS.publish;
  const { form, submit, result, pending } = useActionForm(
    promotionSchema,
    (values) => savePromotionAction(values, id),
    initial,
  );
  // A failed save (like "not enough coins") can be far above the buttons: bring it into view.
  useEffect(() => {
    if (result && !result.ok) scrollToFirstProblem();
  }, [result]);
  const setStatus = (status: PromotionInput["status"]) => () =>
    form.setValue("status", status, { shouldDirty: true });

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
          <ScheduleFields form={form} categories={categories} />
        </SectionCard>
        <SectionCard title="Photos" description={PROMOTIONS_COPY.photosHint}>
          <GalleryUpload
            label="Photos"
            max={MAX_PHOTOS}
            initial={initial.photos.map((key) => ({ id: key, url: mediaUrl(key) }))}
            onUpload={async (file) => {
              const { key, url } = await uploadBusinessImage("promotion", file);
              form.setValue("photos", [...form.getValues("photos"), key], { shouldDirty: true });
              return { id: key, url };
            }}
            onRemove={async (key) => {
              form.setValue("photos", form.getValues("photos").filter((k) => k !== key), { shouldDirty: true });
            }}
          />
        </SectionCard>
        <SectionCard
          title="Call to action"
          description="The button people see on your promotion."
        >
          <CtaFields form={form} />
        </SectionCard>
        <SectionCard
          title={PUBLISH_COPY.title}
          description={PUBLISH_COPY.description}
        >
          <PublishCost balance={balance} publishFee={publishFee} />
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
