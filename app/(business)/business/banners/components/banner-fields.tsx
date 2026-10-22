import type { UseFormRegisterReturn } from "react-hook-form";

import { SectionCard } from "@/components/business/section-card";
import { ImageUpload } from "@/components/shared/image-upload";
import { Input } from "@/components/ui/input";

import { BANNERS_COPY } from "../constant/banner.constant";

interface BannerFieldsProps {
  register: (name: "title" | "description") => UseFormRegisterReturn;
  errors: { title?: string; description?: string; imageKey?: string };
  descriptionLength: number;
  /** The picture already saved, shown in the upload box (editing only). */
  savedImageUrl?: string | null;
  /** The chosen picture, or null when it was removed. */
  onPicture: (file: File | null) => void;
}

/** The picture, headline and short text of a banner. Shared by the create and edit forms. */
export function BannerFields({ register, errors, descriptionLength, savedImageUrl, onPicture }: BannerFieldsProps) {
  return (
    <SectionCard title="Image and text">
      <div className="space-y-4">
        <ImageUpload
          label="Banner image"
          hint={BANNERS_COPY.imageHint}
          idealRatio={21 / 8}
          ratioNote={BANNERS_COPY.imageRatioNote}
          previewClassName="aspect-[16/6] w-full max-w-md rounded-xl"
          value={savedImageUrl}
          onChoose={onPicture}
        />
        {errors.imageKey && (
          <p role="alert" className="text-sm text-destructive">
            {errors.imageKey}
          </p>
        )}
        <Input label="Headline" error={errors.title} maxLength={60} {...register("title")} />
        <Input label="Short text (optional)" hint={`${descriptionLength}/100`} error={errors.description} maxLength={100} {...register("description")} />
      </div>
    </SectionCard>
  );
}
