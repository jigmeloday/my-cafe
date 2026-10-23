"use client";

import { useState } from "react";

import { PhotoLightbox } from "@/components/shared/photo-lightbox";
import { Photo } from "@/components/shared/photo";

/** The business's photo grid. Click a photo to see it whole. */
export function BusinessGallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {photos.map((url, i) => (
          <li key={url} className="aspect-square overflow-hidden rounded-xl bg-muted">
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${photos.length}`} className="block size-full cursor-zoom-in">
              <Photo src={url} alt={`Photo ${i + 1}`} sizes="(min-width: 640px) 25vw, 50vw" className="size-full" />
            </button>
          </li>
        ))}
      </ul>
      <PhotoLightbox photos={photos} index={open} onIndexChange={setOpen} />
    </>
  );
}
