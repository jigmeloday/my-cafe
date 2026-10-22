"use client";

import { useEffect, useRef, useState } from "react";

import { BannerImage } from "@/components/shared/banner-image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

interface BannerPreviewProps {
  businessName: string;
  title: string;
  description: string;
  imageUrl: string | null;
}

/** The banner is drawn at its real desktop size, then shrunk to fit, so the preview looks exactly like the home page. */
const DESIGN_WIDTH = 1000;
const DESIGN_HEIGHT = Math.round((DESIGN_WIDTH * 8) / 21);

export function BannerPreview({ businessName, title, description, imageUrl }: BannerPreviewProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / DESIGN_WIDTH);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Preview</p>
      <div ref={box} className="w-full overflow-hidden rounded-2xl" style={{ height: DESIGN_HEIGHT * scale }} aria-label="Banner preview" role="img">
        <div className="relative origin-top-left overflow-hidden rounded-3xl" style={{ width: DESIGN_WIDTH, height: DESIGN_HEIGHT, transform: `scale(${scale})` }}>
          {imageUrl ? (
            <BannerImage src={imageUrl} className="size-full" />
          ) : (
            <ImagePlaceholder label="Your banner image" className="size-full text-2xl" />
          )}
          <div className="absolute bottom-8 left-12 w-80 space-y-3 rounded-2xl bg-surface p-5 shadow-xl">
            <div className="flex items-center justify-between text-xs">
              <span className="truncate font-semibold text-primary">{businessName}</span>
              <span className="shrink-0 text-muted-foreground">Sponsored</span>
            </div>
            <h3 className="line-clamp-2">{title || "Your headline"}</h3>
            {description && <p className="line-clamp-2 text-sm text-muted-foreground">{description}</p>}
            <span className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground">View offer</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Shown wide at the top of the home page. Clicking it opens your business page. On a phone the text sits under the image. Your whole image is always shown; if its shape differs, the spare space is filled with a soft blur.</p>
    </div>
  );
}
