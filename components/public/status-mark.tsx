"use client";

import { motion, MotionConfig } from "framer-motion";
import { MapPin } from "lucide-react";

/** A status code with Nook's map pin as one of the zeros ("404", "500"). The pin drops in once; nothing loops. */
export function StatusMark({ before, after }: { before: string; after: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden className="flex items-center justify-center gap-2 text-8xl font-bold tracking-tight text-primary sm:gap-4 sm:text-9xl">
        <span>{before}</span>
        <motion.span
          initial={{ y: -48, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="grid size-24 place-items-center rounded-full bg-maroon-soft sm:size-32"
        >
          <MapPin className="size-14 sm:size-20" strokeWidth={2.25} />
        </motion.span>
        <span>{after}</span>
      </div>
    </MotionConfig>
  );
}
