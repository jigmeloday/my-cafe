import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { GALLERY_ITEMS } from "../constant/business.constant";

/** Real photos when given, otherwise the placeholder tiles. */
export function BusinessGallery({ photos }: { photos?: string[] }) {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {photos
        ? photos.map((url, i) => (
            <li key={url} className="aspect-square overflow-hidden rounded-xl bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`Photo ${i + 1}`} loading="lazy" className="size-full object-cover" />
            </li>
          ))
        : GALLERY_ITEMS.map((label) => (
            <li key={label}>
              <ImagePlaceholder label={label} className="aspect-square rounded-xl" />
            </li>
          ))}
    </ul>
  );
}
