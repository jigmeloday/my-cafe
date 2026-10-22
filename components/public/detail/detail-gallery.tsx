"use client";

import { useState } from "react";

import { PhotoLightbox } from "@/components/shared/photo-lightbox";

const OPEN_LABEL = (n: number, total: number) => `Open photo ${n} of ${total}`;

/** The business's photos for a promotion: one whole photo, or a mosaic when there are several. Click any to enlarge. */
export function DetailGallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const several = photos.length > 1;

  return (
    <>
      {several ? (
        <div className="grid gap-2 overflow-hidden rounded-3xl md:h-[26rem] md:grid-cols-4 md:grid-rows-2">
          {photos.slice(0, 5).map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={OPEN_LABEL(i + 1, photos.length)}
              className={i === 0 ? "aspect-4/3 cursor-zoom-in md:col-span-2 md:row-span-2 md:aspect-auto" : "hidden cursor-zoom-in md:block"}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" loading={i === 0 ? undefined : "lazy"} className="size-full bg-muted object-cover" />
            </button>
          ))}
        </div>
      ) : (
        // One photo is shown whole (never cropped to a strip); a tall one sits centred on a soft background.
        <button type="button" onClick={() => setOpen(0)} aria-label={OPEN_LABEL(1, 1)} className="flex w-full cursor-zoom-in justify-center overflow-hidden rounded-3xl bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photos[0]} alt="" className="max-h-[26rem] w-auto max-w-full object-contain" />
        </button>
      )}
      <PhotoLightbox photos={photos} index={open} onIndexChange={setOpen} />
    </>
  );
}
