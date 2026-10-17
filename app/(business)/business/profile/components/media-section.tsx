"use client";

import { SectionCard } from "@/components/business/section-card";
import { GalleryUpload } from "@/components/shared/gallery-upload";
import { ImageUpload } from "@/components/shared/image-upload";
import { MAX_GALLERY } from "@/lib/media";
import { removeBusinessImage, uploadBusinessImage } from "@/lib/upload-client";
import type { BusinessMedia } from "@/services/business/business.service";

import { CARD_COPY } from "../constant/profile.constant";

export function MediaSection({ media }: { media: BusinessMedia }) {
  return (
    <div className="space-y-4">
      <SectionCard title={CARD_COPY.brand.title} description={CARD_COPY.brand.description}>
        <div className="space-y-6">
          <ImageUpload
            label="Logo"
            hint="Square, at least 400 × 400. JPG, PNG or WebP, up to 5 MB."
            previewClassName="size-24 rounded-full"
            value={media.logo || null}
            onUpload={async (file) => (await uploadBusinessImage("logo", file)).url}
            onRemove={() => removeBusinessImage("logo")}
          />
          <ImageUpload
            label="Cover photo"
            hint="Wide, about 1600 × 500. JPG, PNG or WebP, up to 5 MB."
            previewClassName="aspect-[16/5] w-full max-w-md rounded-xl"
            value={media.cover || null}
            onUpload={async (file) => (await uploadBusinessImage("cover", file)).url}
            onRemove={() => removeBusinessImage("cover")}
          />
        </div>
      </SectionCard>
      <SectionCard title={CARD_COPY.gallery.title} description={CARD_COPY.gallery.description}>
        <GalleryUpload
          label="Photos"
          max={MAX_GALLERY}
          initial={media.gallery}
          onUpload={async (file) => {
            const { key, url } = await uploadBusinessImage("gallery", file);
            return { id: key, url };
          }}
          onRemove={(key) => removeBusinessImage("gallery", key)}
        />
      </SectionCard>
    </div>
  );
}
