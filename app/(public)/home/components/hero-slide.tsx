import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";

import type { HeroSlideData } from "../model/home.type";

export function HeroSlide({ slide }: { slide: HeroSlideData }) {
  return (
    <article className="relative aspect-4/5 w-[92%] shrink-0 snap-start overflow-hidden rounded-3xl sm:aspect-16/9 md:aspect-21/8 md:w-[88%]">
      <ImagePlaceholder label={slide.imageLabel} className="size-full" />
      <div className="absolute inset-x-3 bottom-3 space-y-3 rounded-2xl bg-surface p-5 shadow-xl sm:inset-x-auto sm:bottom-8 sm:left-8 sm:w-80 md:left-12">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">{slide.eyebrow}</span>
          {slide.sponsored && (
            <span className="text-muted-foreground">Sponsored</span>
          )}
        </div>
        <h3>{slide.title}</h3>
        <p className="text-sm text-muted-foreground">{slide.description}</p>
        <Button render={<Link href={slide.href} />} size="sm">
          {slide.cta}
        </Button>
      </div>
    </article>
  );
}
