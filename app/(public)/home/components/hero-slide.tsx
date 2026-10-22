"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ReportButton } from "@/components/public/report-button";
import { Button } from "@/components/ui/button";
import { BannerImage } from "@/components/shared/banner-image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { trackBanner } from "@/lib/track-client";
import { cn } from "@/lib/utils";

import type { HeroSlideData } from "../model/home.type";

export function HeroSlide({ slide, active = true }: { slide: HeroSlideData; active?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { bannerId } = slide;

  // A banner counts as seen once, when more than half of it is on screen.
  useEffect(() => {
    if (!bannerId || !ref.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          trackBanner(bannerId, "VIEW");
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [bannerId]);

  return (
    // On a phone the picture sits above its text; from a tablet up the text card sits over the picture's corner.
    <article
      ref={ref}
      className={cn(
        "relative w-full shrink-0 snap-start overflow-hidden rounded-3xl bg-surface transition-[opacity,transform] duration-700 ease-out max-sm:border sm:w-[92%] md:w-[88%]",
        !active && "scale-[0.97] opacity-60",
      )}
    >
      {slide.imageUrl ? (
        <BannerImage src={slide.imageUrl} className="aspect-16/10 sm:aspect-16/9 md:aspect-21/8" />
      ) : (
        <ImagePlaceholder label={slide.imageLabel} className="aspect-16/10 sm:aspect-16/9 md:aspect-21/8" />
      )}
      <div className="space-y-3 bg-surface p-5 sm:absolute sm:bottom-8 sm:left-8 sm:w-80 sm:rounded-2xl sm:shadow-xl md:left-12">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">{slide.eyebrow}</span>
          {slide.sponsored && (
            <span className="flex items-center gap-2 text-muted-foreground">
              Sponsored
              {bannerId && <ReportButton bannerId={bannerId} variant="link" />}
            </span>
          )}
        </div>
        <h3>{slide.title}</h3>
        {slide.description && <p className="text-sm text-muted-foreground">{slide.description}</p>}
        {slide.href && (
          <Button render={<Link href={slide.href} onClick={bannerId ? () => trackBanner(bannerId, "CLICK") : undefined} />} size="sm">
            {slide.cta}
          </Button>
        )}
      </div>
    </article>
  );
}
