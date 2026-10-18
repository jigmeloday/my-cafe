"use client";

import { useState } from "react";
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
import { uploadBusinessImage } from "@/lib/upload-client";
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
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { form, submit, result, pending } = useActionForm(
    bannerSchema,
    (values) => createBannerAction({ ...values, promotionId: values.promotionId === NONE ? "" : values.promotionId }),
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
              previewClassName="aspect-[16/6] w-full max-w-md rounded-xl"
              value={imageUrl}
              onUpload={async (file) => {
                const { key, url } = await uploadBusinessImage("banner", file);
                setValue("imageKey", key, { shouldDirty: true, shouldValidate: true });
                setImageUrl(url);
                return url;
              }}
              onRemove={async () => {
                setValue("imageKey", "", { shouldDirty: true });
                setImageUrl(null);
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
