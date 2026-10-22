"use client";

import { useEffect, useRef, useState } from "react";

import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { GalleryUpload } from "@/components/shared/gallery-upload";
import { Button } from "@/components/ui/button";
import { COIN_COSTS } from "@/lib/coins";
import { extensionCost, listingCost, listingDays } from "@/lib/listing";
import { mediaUrl } from "@/lib/media";
import { discardUploads, uploadChosen } from "@/lib/pending-upload";
import { scrollToFirstProblem } from "@/lib/scroll";
import { useWatch } from "react-hook-form";

import { todayIso } from "@/lib/formatters/date";
import { featuredPrice } from "@/lib/featured";
import type { OwnBooking } from "@/services/featured/featured.service";
import { useActionForm } from "@/hooks/use-action-form";
import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/validations/promotion.schema";
import { savePromotionAction } from "@/server/actions/promotion.actions";

import {
  MAX_PHOTOS,
  FEATURE_COPY,
  PUBLISH_COPY,
  PROMOTIONS_COPY,
} from "../constant/promotion.constant";
import type { OptionItem } from "../model/promotion.type";
import { CtaFields } from "./cta-fields";
import { DetailsFields } from "./details-fields";
import { PromotionPreview } from "./promotion-preview";
import { FeatureFields } from "./feature-fields";
import { PublishCost } from "./publish-cost";
import { ScheduleFields } from "./schedule-fields";

interface PromotionFormProps {
  /** Places left on each day, for the Feature section. */
  availability: Record<string, number>;
  /** Bookings this promotion already has (editing only). */
  bookings?: OwnBooking[];
  initial: PromotionInput;
  categories: OptionItem[];
  /** Set when editing an existing promotion. */
  id?: string;
  /** Coins in the business wallet. */
  balance: number;
}

export function PromotionForm({ initial, categories, id, balance, availability, bookings = [] }: PromotionFormProps) {
  // New photos stay on this device until the promotion is saved, so one that is removed costs no storage.
  const chosen = useRef(new Map<string, File>());
  const [chosenCount, setChosenCount] = useState(0);
  const { form, submit, result, pending } = useActionForm(
    promotionSchema,
    async (values) => {
      let keys: string[] = [];
      try {
        keys = await uploadChosen("promotion", [...chosen.current.values()]);
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "The upload failed. Please try again." };
      }
      const outcome = await savePromotionAction({ ...values, photos: [...values.photos, ...keys] }, id);
      // Not saved (for example not enough coins): don't leave the sent photos behind.
      if (!outcome.ok) await discardUploads("promotion", keys);
      return outcome;
    },
    { ...initial, featureStart: initial.featureStart || todayIso() },
    { forceDirty: chosenCount > 0 },
  );
  // A failed save (like "not enough coins") can be far above the buttons: bring it into view.
  useEffect(() => {
    if (result && !result.ok) scrollToFirstProblem();
  }, [result]);
  const [featureDays, startDate, endDate] = useWatch({ control: form.control, name: ["featureDays", "startDate", "endDate"] });
  // Every day it runs is paid when it goes live. A live promotion only pays for days added to its end.
  const isLive = Boolean(id) && initial.status === "PUBLISHED";
  const runDays = startDate && endDate ? listingDays(startDate, endDate, todayIso()) : 0;
  const publishFee = isLive ? (initial.endDate && endDate ? extensionCost(initial.endDate, endDate) : 0) : listingCost(runDays);
  const publishNote = isLive
    ? undefined
    : runDays > 0 ? PUBLISH_COPY.perDay(runDays, COIN_COSTS.publishPerDay) : undefined;
  const featuredFee = featuredPrice(Number(featureDays));
  // Publishing needs the coins up front; saving a draft is free, so only the publish button waits on them.
  const cantAfford = publishFee + featuredFee > balance;
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
            onPick={(photoId, file) => {
              chosen.current.set(photoId, file);
              setChosenCount(chosen.current.size);
            }}
            onRemove={async (photoId) => {
              // A photo still on this device was never sent; a saved one is taken off the promotion.
              chosen.current.delete(photoId);
              setChosenCount(chosen.current.size);
              form.setValue("photos", form.getValues("photos").filter((k) => k !== photoId), { shouldDirty: true });
            }}
          />
        </SectionCard>
        <SectionCard
          title="Call to action"
          description="The button people see on your promotion."
        >
          <CtaFields form={form} />
        </SectionCard>
        <SectionCard title={FEATURE_COPY.title} description={FEATURE_COPY.description}>
          <FeatureFields form={form} availability={availability} bookings={bookings} />
        </SectionCard>
        <SectionCard
          title={PUBLISH_COPY.title}
          description={PUBLISH_COPY.description}
        >
          <PublishCost balance={balance} publishFee={publishFee} publishNote={publishNote} featuredFee={featuredFee} />
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
            disabled={pending || cantAfford}
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
