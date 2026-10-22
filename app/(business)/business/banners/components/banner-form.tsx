"use client";

import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import { SectionCard } from "@/components/business/section-card";
import { CoinCostSummary } from "@/components/business/coin-cost-summary";
import { DateField } from "@/components/shared/date-field";
import { FormMessage } from "@/components/shared/form-message";
import { ImageUpload } from "@/components/shared/image-upload";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { COIN_COSTS } from "@/lib/coins";
import { todayIso } from "@/lib/formatters/date";
import { discardUploads, PENDING_IMAGE, uploadChosen } from "@/lib/pending-upload";
import { bannerSchema } from "@/lib/validations/banner.schema";
import { createBannerAction } from "@/server/actions/banner.actions";

import { BANNERS_COPY, DAY_OPTIONS } from "../constant/banner.constant";
import { BannerPreview } from "./banner-preview";

interface BannerFormProps {
  businessName: string;
  /** The owner's live promotions a banner can open. */
  promotions: { value: string; label: string }[];
  balance: number;
}

const NONE = "none";

export function BannerForm({ businessName, promotions, balance }: BannerFormProps) {
  // The picture stays on this device until the banner is saved, so a picture that is changed or removed costs no storage.
  const [file, setFile] = useState<File | null>(null);
  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const { form, submit, result, pending } = useActionForm(
    bannerSchema,
    async (values) => {
      if (!file) return { ok: false, error: "Add a banner image" };
      let key: string;
      try {
        [key] = await uploadChosen("banner", [file]);
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "The upload failed. Please try again." };
      }
      const outcome = await createBannerAction({ ...values, imageKey: key, promotionId: values.promotionId === NONE ? "" : values.promotionId });
      // Not saved (for example not enough coins): don't leave the sent picture behind.
      if (!outcome.ok) await discardUploads("banner", [key]);
      return outcome;
    },
    { title: "", description: "", promotionId: NONE, imageKey: "", startDate: todayIso(), days: "7" as const },
  );
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const [title, description, days] = useWatch({ control, name: ["title", "description", "days"] });
  const cost = Number(days) * COIN_COSTS.bannerPerDay;

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 space-y-4">
        {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
        <SectionCard title="Image and text">
          <div className="space-y-4">
            <ImageUpload
              label="Banner image"
              hint={BANNERS_COPY.imageHint}
              idealRatio={21 / 8}
              ratioNote={BANNERS_COPY.imageRatioNote}
              previewClassName="aspect-[16/6] w-full max-w-md rounded-xl"
              onChoose={(chosen) => {
                setFile(chosen);
                setValue("imageKey", chosen ? PENDING_IMAGE : "", { shouldDirty: true, shouldValidate: true });
              }}
            />
            {errors.imageKey?.message && (
              <p role="alert" className="text-sm text-destructive">
                {errors.imageKey.message}
              </p>
            )}
            <Input label="Headline" error={errors.title?.message} maxLength={60} {...register("title")} />
            <Input label="Short text (optional)" hint={`${description?.length ?? 0}/100`} error={errors.description?.message} maxLength={100} {...register("description")} />
          </div>
        </SectionCard>
        <SectionCard title="Where it leads" description="What opens when someone clicks the banner.">
          <SelectField
            control={control}
            name="promotionId"
            label="Opens"
            options={[{ value: NONE, label: BANNERS_COPY.businessPage }, ...promotions]}
            error={errors.promotionId?.message}
          />
        </SectionCard>
        <SectionCard title="When it runs">
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField control={control} name="startDate" label="First day" min={todayIso()} error={errors.startDate?.message} />
            <SelectField control={control} name="days" label="For how long" options={DAY_OPTIONS} error={errors.days?.message} />
          </div>
        </SectionCard>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Creating…" : BANNERS_COPY.submit}
        </Button>
      </div>
      <aside className="min-w-0 space-y-4">
        <BannerPreview businessName={businessName} title={title} description={description} imageUrl={imageUrl} />
        <CoinCostSummary cost={cost} balance={balance} label="Cost to run" />
      </aside>
    </form>
  );
}
