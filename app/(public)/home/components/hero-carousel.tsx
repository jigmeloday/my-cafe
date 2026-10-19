"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollRow } from "@/hooks/use-scroll-row";

import type { HeroSlideData } from "../model/home.type";
import { HeroSlide } from "./hero-slide";

export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const { ref, index, canPrev, canNext, scrollPrev, scrollNext } =
    useScrollRow<HTMLDivElement>();

  return (
    <section aria-label="Featured" className="space-y-4">
      <div className="relative">
        <div
          ref={ref}
          className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto"
        >
          {slides.map((slide) => (
            <HeroSlide key={slide.id} slide={slide} />
          ))}
        </div>
        {canPrev && (
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Previous slide"
            onClick={scrollPrev}
            className="absolute top-1/2 left-3 hidden -translate-y-1/2 rounded-full shadow-md sm:inline-flex"
          >
            <ChevronLeft />
          </Button>
        )}
        {canNext && (
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Next slide"
            onClick={scrollNext}
            className="absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-full shadow-md sm:inline-flex"
          >
            <ChevronRight />
          </Button>
        )}
      </div>
      <div className="flex justify-center gap-2" aria-hidden>
        {slides.map((slide, i) => (
          <span
            key={slide.id}
            className={cn(
              "size-1.5 rounded-full bg-foreground/25 transition-all",
              i === index && "w-4 bg-foreground",
            )}
          />
        ))}
      </div>
    </section>
  );
}
