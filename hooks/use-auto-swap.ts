"use client";

import { useEffect, useRef } from "react";

type Options = { count: number; intervalMs?: number };

const TOUCH_PAUSE_MS = 8000;

/**
 * Moves a scroll-snap row to its next slide on a timer, looping back to the first.
 * Stays put while the visitor hovers, focuses, touches the row, or when the tab is hidden,
 * and does nothing for people who asked for reduced motion.
 */
export function useAutoSwap<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { count, intervalMs = 5000 }: Options,
) {
  const pausedUntil = useRef(0);
  const holds = useRef(0);

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      const el = ref.current;
      if (!el || holds.current > 0 || document.hidden || Date.now() < pausedUntil.current) return;
      const slides = Array.from(el.children) as HTMLElement[];
      const origin = el.getBoundingClientRect().left;
      const offsets = slides.map((s) => s.getBoundingClientRect().left - origin + el.scrollLeft);
      const current = offsets.reduce((best, x, i) => (Math.abs(x - el.scrollLeft) < Math.abs(offsets[best] - el.scrollLeft) ? i : best), 0);
      el.scrollTo({ left: offsets[(current + 1) % slides.length], behavior: "smooth" });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [ref, count, intervalMs]);

  return {
    onMouseEnter: () => void (holds.current += 1),
    onMouseLeave: () => void (holds.current = Math.max(0, holds.current - 1)),
    onFocus: () => void (holds.current += 1),
    onBlur: () => void (holds.current = Math.max(0, holds.current - 1)),
    onTouchStart: () => void (pausedUntil.current = Date.now() + TOUCH_PAUSE_MS),
  };
}
