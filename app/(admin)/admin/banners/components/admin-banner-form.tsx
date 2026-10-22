"use client";

import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

import { BannerPreview } from "@/app/(business)/business/banners/components/banner-preview";
import { BANNERS_COPY } from "@/app/(business)/business/banners/constant/banner.constant";
import { SectionCard } from "@/components/business/section-card";
import { DateField } from "@/components/shared/date-field";
import { FormMessage } from "@/components/shared/form-message";
import { ImageUpload } from "@/components/shared/image-upload";
import { SelectField } from "@/components/shared/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionForm } from "@/hooks/use-action-form";
import { todayIso } from "@/lib/formatters/date";
import { ANNOUNCEMENT } from "@/lib/media";
import { discardUploads, PENDING_IMAGE, uploadChosen } from "@/lib/pending-upload";
import { ADMIN_BANNER_DAYS, adminBannerSchema } from "@/lib/validations/banner.schema";
import { createAdminBannerAction } from "@/server/actions/banner.actions";

const DAY_OPTIONS = ADMIN_BANNER_DAYS.map((days) => ({ value: days, label: `${days} days` }));

export function AdminBannerForm({ businesses }: { businesses: { id: string; name: string }[] }) {
  // The picture stays on this device until the banner is saved, so one that is changed or removed costs no storage.
  const [file, setFile] = useState<File | null>(null);
  const imageUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const { form, submit, result, pending } = useActionForm(
    adminBannerSchema,
    async (values) => {
      if (!file) return { ok: false, error: "Add a banner image" };
      let key: string;
      try {
        [key] = await uploadChosen("banner", [file], values.businessId);
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : "The upload failed. Please try again." };
      }
      const outcome = await createAdminBannerAction({ ...values, imageKey: key });
      if (!outcome.ok) await discardUploads("banner", [key], values.businessId);
      return outcome;
    },
    { businessId: ANNOUNCEMENT, title: "", description: "", imageKey: "", linkUrl: "", startDate: todayIso(), days: "7" as const },
  );
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = form;
  const [businessId, title, description] = useWatch({ control, name: ["businessId", "title", "description"] });
  const isAnnouncement = businessId === ANNOUNCEMENT;
  const businessName = isAnnouncement ? "Nook" : (businesses.find((b) => b.id === businessId)?.name ?? "Business name");
  const options = [{ value: ANNOUNCEMENT, label: "Nook announcement (the whole site)" }, ...businesses.map((b) => ({ value: b.id, label: b.name }))];

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <div className="min-w-0 space-y-4">
        {result && !result.ok && <FormMessage tone="error">{result.error}</FormMessage>}
        <SectionCard title="Who is it for?" description="An announcement is your own banner for the whole site. Or make one for a business.">
          <SelectField control={control} name="businessId" label="Banner for" options={options} error={errors.businessId?.message} />
        </SectionCard>
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
            {errors.imageKey?.message && <p role="alert" className="text-sm text-destructive">{errors.imageKey.message}</p>}
            <Input label="Headline" error={errors.title?.message} maxLength={60} {...register("title")} />
            {isAnnouncement && (
              <Input label="Link (optional)" hint="Where the button goes: a full link or a page like /deals. Leave empty for no button." error={errors.linkUrl?.message} placeholder="https://" {...register("linkUrl")} />
            )}
            <Input label="Short text (optional)" hint={`${description?.length ?? 0}/100`} error={errors.description?.message} maxLength={100} {...register("description")} />
          </div>
        </SectionCard>
        <SectionCard title="When it runs">
          <div className="grid gap-4 sm:grid-cols-2">
            <DateField control={control} name="startDate" label="First day" min={todayIso()} error={errors.startDate?.message} />
            <SelectField control={control} name="days" label="For how long" options={DAY_OPTIONS} error={errors.days?.message} />
          </div>
        </SectionCard>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Creating…" : "Create banner"}
        </Button>
      </div>
      <aside className="min-w-0">
        <BannerPreview businessName={businessName} title={title} description={description} imageUrl={imageUrl} />
      </aside>
    </form>
  );
}
