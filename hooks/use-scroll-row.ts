"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { smoothScrollTo } from "@/lib/smooth-scroll";

const EDGE = 4;

export function useScrollRow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [state, setState] = useState({
    canPrev: false,
    canNext: true,
    index: 0,
  });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const step = (el.firstElementChild as HTMLElement | null)?.offsetWidth || 1;
    setState({
      canPrev: el.scrollLeft > EDGE,
      canNext: el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE,
      index: Math.round(el.scrollLeft / step),
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const raf = requestAnimationFrame(update);
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) smoothScrollTo(el, el.scrollLeft + dir * el.clientWidth * 0.9, 700);
  };

  return {
    ref,
    ...state,
    scrollPrev: () => scrollBy(-1),
    scrollNext: () => scrollBy(1),
  };
}
