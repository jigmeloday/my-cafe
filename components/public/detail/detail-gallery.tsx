import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { GALLERY_LABELS } from "../constant/detail.constant";

export function DetailGallery() {
  const [main, ...rest] = GALLERY_LABELS;

  return (
    <div className="grid gap-2 overflow-hidden rounded-3xl md:h-[26rem] md:grid-cols-4 md:grid-rows-2">
      <ImagePlaceholder
        label={main}
        className="aspect-4/3 md:col-span-2 md:row-span-2 md:aspect-auto"
      />
      {rest.map((label) => (
        <ImagePlaceholder
          key={label}
          label={label}
          className="hidden md:grid"
        />
      ))}
    </div>
  );
}
