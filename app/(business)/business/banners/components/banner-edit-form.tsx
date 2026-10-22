"use client";

import { useWatch } from "react-hook-form";

import { CoinCostSummary } from "@/components/business/coin-cost-summary";
import { SectionCard } from "@/components/business/section-card";
import { FormMessage } from "@/components/shared/form-message";
import { SelectField } from "@/components/shared/select-field";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { useActionForm } from "@/hooks/use-action-form";
import { COIN_COSTS } from "@/lib/coins";
import { formatDate } from "@/lib/formatters/date";
import { discardUploads, PENDING_IMAGE, uploadChosen } from "@/lib/pending-upload";
import { bannerEditSchema, BANNER_DAYS, MAX_BANNER_DAYS } from "@/lib/validations/banner.schema";
import { updateBannerAction } from "@/server/actions/banner.actions";
import type { BannerRow } from "@/services/banner/banner.service";

import { BANNERS_COPY, STATUS_LABELS, STATUS_TONES } from "../constant/banner.constant";
import { useBannerPicture } from "../hooks/use-banner-picture";
import { BannerFields } from "./banner-fields";
import { BannerPreview } from "./banner-preview";

interface BannerEditFormProps {
  banner: BannerRow;
  businessName: string;
  balance: number;
}

export function BannerEditForm({ banner, businessName, balance }: BannerEditFormProps) {
  const { file, setFile, previewUrl } = useBannerPicture();
  const { form, submit, result, pending } = useActionForm(
    bannerEditSchema,
    async (values) => {
      let key = values.imageKey;
      if (key === PENDING_IMAGE) {
        if (!file) return { ok: false, error: "Add a banner image" };
        try {
          [key] = await uploadChosen("banner", [file]);
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : "The upload failed. Please try again." };
        }
      }
      const outcome = await updateBannerAction(banner.id, { ...values, imageKey: key });
      // Not saved (for example not enough coins): don't leave a newly sent picture behind.
      if (!outcome.ok && key !== banner.imageKey) await discardUploads("banner", [key]);
      return outcome;
    },
    { title: banner.title, description: banner.description, imageKey: banner.imageKey, extraDays: "0" as const },
  );
  const { register, control, setValue, formState: { errors } } = form;
  const [title, description, imageKey, extraDays] = useWatch({ control, name: ["title", "description", "imageKey", "extraDays"] });

  const cost = Number(extraDays) * COIN_COSTS.bannerPerDay;
  // Only lengths that keep the whole run within the limit can be added.
  const extraOptions = [
    { value: "0", label: BANNERS_COPY.noExtra },
    ...BANNER_DAYS.filter((days) => banner.days + Number(days) <= MAX_BANNER_DAYS).map((days) => ({
      value: days,
      label: `+${days} days · ${(Number(days) * COIN_COSTS.bannerPerDay).toLocaleString("en")} coins`,
    })),
  ];
  const shownImage = imageKey === PENDING_IMAGE ? previewUrl : imageKey ? banner.imageUrl : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 space-y-4">
        {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
        <BannerFields
          register={register}
          errors={{ title: errors.title?.message, description: errors.description?.message, imageKey: errors.imageKey?.message }}
          descriptionLength={description?.length ?? 0}
          savedImageUrl={banner.imageUrl}
          onPicture={(chosen) => {
            setFile(chosen);
            setValue("imageKey", chosen ? PENDING_IMAGE : "", { shouldDirty: true, shouldValidate: true });
          }}
        />
        <SectionCard title="When it runs" description="The days you paid for stay as they are. You can only add days at the end.">
          <div className="space-y-4">
            <p className="flex flex-wrap items-center gap-2 text-sm">
              <StatusBadge tone={STATUS_TONES[banner.status]}>{STATUS_LABELS[banner.status]}</StatusBadge>
              {formatDate(banner.startDate)} – {formatDate(banner.endDate)} · {banner.days} days
            </p>
            {extraOptions.length > 1 && (
              <SelectField control={control} name="extraDays" label="Add more days" options={extraOptions} error={errors.extraDays?.message} />
            )}
          </div>
        </SectionCard>
        <Button type="submit" size="lg" disabled={pending || cost > balance}>
          {pending ? "Saving…" : cost > 0 ? BANNERS_COPY.savePaid : BANNERS_COPY.save}
        </Button>
      </div>
      <aside className="min-w-0 space-y-4">
        <BannerPreview businessName={businessName} title={title} description={description} imageUrl={shownImage} />
        {cost > 0 && <CoinCostSummary cost={cost} balance={balance} label="Cost of the added days" />}
      </aside>
    </form>
  );
}
