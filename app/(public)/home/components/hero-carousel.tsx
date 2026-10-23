"use client";

import { motion, MotionConfig, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Swiper as SwiperInstance } from "swiper/types";
import { A11y, Autoplay, Keyboard } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Button } from "@/components/ui/button";
import { SOFT_SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { HERO_SWIPER } from "../constant/hero.constant";
import type { HeroSlideData } from "../model/home.type";
import { HeroSlide } from "./hero-slide";

const ARROW = "absolute top-1/2 z-10 hidden -translate-y-1/2 sm:block";

/** The banners at the top of the home page: swipe, drag, use the arrows or dots, or let it play on its own. */
export function HeroCarousel({ slides }: { slides: HeroSlideData[] }) {
  const swiper = useRef<SwiperInstance | null>(null);
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();
  const many = slides.length > 1;

  // It plays on its own, but not while the tab is hidden: nobody is watching.
  useEffect(() => {
    const onVisibility = () => (document.hidden ? swiper.current?.autoplay?.stop() : swiper.current?.autoplay?.start());
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    // Respects "reduce motion": people who turned it on get no sliding, scaling or automatic playing.
    <MotionConfig reducedMotion="user">
      <section aria-label="Featured" className="space-y-4">
        <div className="relative">
          <Swiper
            className="hero-swiper"
            modules={[Autoplay, Keyboard, A11y]}
            onSwiper={(s) => (swiper.current = s)}
            onSlideChange={(s) => setIndex(s.activeIndex)}
            speed={reduced ? 0 : HERO_SWIPER.speedMs}
            autoplay={many && !reduced ? { delay: HERO_SWIPER.delayMs, disableOnInteraction: false, pauseOnMouseEnter: true } : false}
            rewind
            grabCursor={many}
            allowTouchMove={many}
            keyboard={{ enabled: true }}
            spaceBetween={HERO_SWIPER.gap}
            slidesPerView={1}
            breakpoints={HERO_SWIPER.breakpoints}
          >
            {slides.map((slide, i) => (
              <SwiperSlide key={slide.id}>
                <HeroSlide slide={slide} active={i === index} />
              </SwiperSlide>
            ))}
          </Swiper>
          {many && (
            <>
              <motion.div whileTap={{ scale: 0.92 }} className={cn(ARROW, "left-3")}>
                <Button variant="secondary" size="icon-sm" aria-label="Previous slide" onClick={() => swiper.current?.slidePrev()} className="rounded-full shadow-md">
                  <ChevronLeft />
                </Button>
              </motion.div>
              <motion.div whileTap={{ scale: 0.92 }} className={cn(ARROW, "right-3")}>
                <Button variant="secondary" size="icon-sm" aria-label="Next slide" onClick={() => swiper.current?.slideNext()} className="rounded-full shadow-md">
                  <ChevronRight />
                </Button>
              </motion.div>
            </>
          )}
        </div>
        {many && (
          <div className="flex justify-center gap-2">
            {slides.map((slide, i) => (
              <motion.button
                key={slide.id}
                type="button"
                layout
                transition={SOFT_SPRING}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => swiper.current?.slideTo(i)}
                className={cn("h-1.5 rounded-full", i === index ? "w-4 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/50")}
              />
            ))}
          </div>
        )}
      </section>
    </MotionConfig>
  );
}
