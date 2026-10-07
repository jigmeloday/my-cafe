"use client";

import { GalleryUpload } from "@/components/shared/gallery-upload";
import { ImageUpload } from "@/components/shared/image-upload";

import { CARD_COPY, PROFILE_COPY } from "../constant/profile.constant";
import { SectionCard } from "@/components/business/section-card";

export function MediaSection() {
  return (
    <div className="space-y-4">
      <SectionCard
        title={CARD_COPY.brand.title}
        description={CARD_COPY.brand.description}
      >
        <div className="space-y-6">
          <ImageUpload
            label="Logo"
            hint="Square, at least 400 × 400. JPG, PNG or WebP, up to 5 MB."
            previewClassName="size-24 rounded-full"
          />
          <ImageUpload
            label="Cover photo"
            hint="Wide, about 1600 × 500. JPG, PNG or WebP, up to 5 MB."
            previewClassName="aspect-[16/5] w-full max-w-md rounded-xl"
          />
        </div>
      </SectionCard>
      <SectionCard
        title={CARD_COPY.gallery.title}
        description={CARD_COPY.gallery.description}
      >
        <GalleryUpload label="Photos" />
      </SectionCard>
      <p className="text-sm text-muted-foreground">{PROFILE_COPY.mediaNote}</p>
    </div>
  );
}
