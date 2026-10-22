"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface PhotoLightboxProps {
  photos: string[];
  /** The photo shown, or null while closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
  /** Spoken to screen readers, e.g. "Photo 2 of 5". */
  label?: string;
}

/** Fades only: no zoom and no blur, which flicker when the viewer closes. Both edges use the same 150ms. */
const FADE = "transition-opacity duration-150 data-starting-style:opacity-0 data-ending-style:opacity-0";
const CIRCLE = "absolute rounded-full shadow-lg";

/** A photo shown whole, as large as the screen allows, with arrows (and the arrow keys) to move between photos. */
export function PhotoLightbox({ photos, index, onIndexChange, label = "Photo" }: PhotoLightboxProps) {
  const count = photos.length;
  const open = index !== null && count > 0;
  // While the viewer fades out, `index` is already null. Keep showing the last photo until it is gone,
  // otherwise the photo vanishes first and the empty screen flickers.
  const [shown, setShown] = useState(index ?? 0);
  if (index !== null && index !== shown) setShown(index);
  const current = Math.min(shown, Math.max(count - 1, 0));

  useEffect(() => {
    if (index === null || count < 2) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
      if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onIndexChange]);

  // Load the photos either side ahead of time, so moving along never shows an empty frame.
  useEffect(() => {
    if (index === null || count < 2) return;
    [(index + 1) % count, (index - 1 + count) % count].forEach((i) => {
      new window.Image().src = photos[i];
    });
  }, [index, count, photos]);

  const step = (by: number) => onIndexChange((((index ?? 0) + by) % count + count) % count);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onIndexChange(null)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className={`fixed inset-0 z-50 bg-black/85 ${FADE}`} />
        <DialogPrimitive.Popup
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 outline-none sm:p-10 ${FADE}`}
          // The photo sits inside; pressing anywhere around it closes the viewer.
          onClick={(event) => event.target === event.currentTarget && onIndexChange(null)}
        >
          <DialogPrimitive.Title className="sr-only">{`${label} ${current + 1} of ${count}`}</DialogPrimitive.Title>
          {count > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photos[current]} alt={`${label} ${current + 1}`} className="max-h-full max-w-full rounded-xl object-contain" />
          )}
          <DialogPrimitive.Close render={<Button variant="secondary" size="icon" className={`${CIRCLE} top-4 right-4`} />}>
            <X />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
          {count > 1 && (
            <>
              <Button type="button" variant="secondary" size="icon" aria-label="Previous photo" onClick={() => step(-1)} className={`${CIRCLE} top-1/2 left-4 -translate-y-1/2`}>
                <ChevronLeft />
              </Button>
              <Button type="button" variant="secondary" size="icon" aria-label="Next photo" onClick={() => step(1)} className={`${CIRCLE} top-1/2 right-4 -translate-y-1/2`}>
                <ChevronRight />
              </Button>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
