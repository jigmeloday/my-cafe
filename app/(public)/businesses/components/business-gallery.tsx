import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import { GALLERY_ITEMS } from "../constant/business.constant";

export function BusinessGallery() {
  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {GALLERY_ITEMS.map((label) => (
        <li key={label}>
          <ImagePlaceholder
            label={label}
            className="aspect-square rounded-xl"
          />
        </li>
      ))}
    </ul>
  );
}
