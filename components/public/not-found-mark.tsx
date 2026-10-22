"use client";

import { motion, MotionConfig } from "framer-motion";
import { MapPin } from "lucide-react";

/** "404" with Nook's map pin as the zero. The pin drops in once; nothing loops. */
export function NotFoundMark() {
  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="flex items-center justify-center gap-2 text-8xl font-bold tracking-tight text-primary sm:gap-4 sm:text-9xl">
        <span>4</span>
        <motion.span
          initial={{ y: -48, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="grid size-24 place-items-center rounded-full bg-maroon-soft sm:size-32"
        >
          <MapPin className="size-14 sm:size-20" strokeWidth={2.25} />
        </motion.span>
        <span>4</span>
      </div>
    </MotionConfig>
  );
}
