"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

import { ReportButton } from "@/components/public/report-button";
import { Button } from "@/components/ui/button";
import { BannerImage } from "@/components/shared/banner-image";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { EASE_OUT, RISE, STAGGER } from "@/lib/motion";
import { trackBanner } from "@/lib/track-client";

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
    // The slide you are on is bright and full size; its neighbours step back. Its picture settles in and its text rises in one by one.
    <motion.article
      ref={ref}
      animate={{ opacity: active ? 1 : 0.6, scale: active ? 1 : 0.97 }}
      transition={{ duration: 0.7, ease: EASE_OUT }}
      className="relative w-full overflow-hidden rounded-3xl bg-surface max-sm:border"
    >
      <motion.div animate={{ scale: active ? 1 : 1.06 }} transition={{ duration: 1.4, ease: EASE_OUT }}>
        {slide.imageUrl ? (
          <BannerImage src={slide.imageUrl} className="aspect-16/10 sm:aspect-16/9 md:aspect-21/8" />
        ) : (
          <ImagePlaceholder label={slide.imageLabel} className="aspect-16/10 sm:aspect-16/9 md:aspect-21/8" />
        )}
      </motion.div>
      <motion.div
        variants={STAGGER}
        initial="hidden"
        animate={active ? "show" : "hidden"}
        className="space-y-3 bg-surface p-5 sm:absolute sm:bottom-8 sm:left-8 sm:w-80 sm:rounded-2xl sm:shadow-xl md:left-12"
      >
        <motion.div variants={RISE} className="flex items-center justify-between text-xs">
          <span className="font-semibold text-primary">{slide.eyebrow}</span>
          {slide.sponsored && (
            <span className="flex items-center gap-2 text-muted-foreground">
              Sponsored
              {bannerId && <ReportButton bannerId={bannerId} variant="link" />}
            </span>
          )}
        </motion.div>
        <motion.h3 variants={RISE}>{slide.title}</motion.h3>
        {slide.description && (
          <motion.p variants={RISE} className="text-sm text-muted-foreground">
            {slide.description}
          </motion.p>
        )}
        {slide.href && (
          <motion.div variants={RISE}>
            <Button render={<Link href={slide.href} onClick={bannerId ? () => trackBanner(bannerId, "CLICK") : undefined} />} size="sm">
              {slide.cta}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </motion.article>
  );
}
