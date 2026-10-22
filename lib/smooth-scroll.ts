const running = new WeakMap<HTMLElement, () => void>();

/** Starts slow, speeds up, then eases to a stop: much gentler than the browser's own smooth scrolling. */
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Scrolls a row sideways to `left` with a slow, eased glide. Scroll-snapping is switched off while it moves (it
 * would fight the animation) and back on at the end. A touch, wheel or press by the visitor stops it at once, and
 * people who asked for reduced motion get a plain jump.
 */
export function smoothScrollTo(el: HTMLElement, left: number, duration = 1000) {
  running.get(el)?.();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.scrollTo({ left: Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth)) });
    return;
  }

  // A target past the end of the row would be cut off mid-glide, so the ease-out would never be seen.
  const target = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
  const from = el.scrollLeft;
  const distance = target - from;
  if (Math.abs(distance) < 1) return;

  const start = performance.now();
  let frame = 0;
  el.style.scrollSnapType = "none";

  const stop = () => {
    cancelAnimationFrame(frame);
    el.style.scrollSnapType = "";
    for (const type of ["wheel", "touchstart", "pointerdown"]) el.removeEventListener(type, stop);
    running.delete(el);
  };
  for (const type of ["wheel", "touchstart", "pointerdown"]) el.addEventListener(type, stop, { passive: true, once: true });
  running.set(el, stop);

  const step = (now: number) => {
    const progress = Math.min(1, (now - start) / duration);
    el.scrollLeft = from + distance * easeInOutCubic(progress);
    if (progress < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  frame = requestAnimationFrame(step);
}
