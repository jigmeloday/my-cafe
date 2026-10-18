import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { GALLERY_LABELS } from "../constant/detail.constant";

/** Real photos when the business added some, otherwise placeholders. */
export function DetailGallery({ photos }: { photos?: string[] }) {
  if (photos && photos.length > 0) {
    const [first, ...others] = photos;
    return (
      <div className={photos.length > 1 ? "grid gap-2 overflow-hidden rounded-3xl md:h-[26rem] md:grid-cols-4 md:grid-rows-2" : "overflow-hidden rounded-3xl"}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={first} alt="" className={photos.length > 1 ? "aspect-4/3 size-full bg-muted object-cover md:col-span-2 md:row-span-2 md:aspect-auto" : "max-h-[26rem] w-full bg-muted object-cover"} />
        {others.slice(0, 4).map((url) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={url} src={url} alt="" loading="lazy" className="hidden size-full bg-muted object-cover md:block" />
        ))}
      </div>
    );
  }
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
