import type { Transition, Variants } from "framer-motion";

/** Shared animation settings, so the site moves the same way everywhere. */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/** A soft spring for small controls that slide or resize (like the carousel dots). */
export const SOFT_SPRING: Transition = { type: "spring", stiffness: 420, damping: 32 };

/** A group whose children appear one after another when it becomes "show". */
export const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.2 } },
};

/** One child of a `STAGGER` group: rises into place and fades in. Never fully hidden, so a neighbouring slide still reads. */
export const RISE: Variants = {
  hidden: { opacity: 0.35, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};
