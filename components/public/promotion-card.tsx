"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { FavoriteButton } from "@/components/shared/favorite-button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { cn } from "@/lib/utils";

import type { PromotionCardData } from "./model/promotion.type";

export function PromotionCard({
  item,
  className,
}: {
  item: PromotionCardData;
  className?: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("relative w-full space-y-2", className)}
    >
      <div className="relative">
        <ImagePlaceholder className="aspect-square rounded-2xl" />
        {item.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold shadow-sm">
            {item.badge}
          </span>
        )}
        <FavoriteButton className="absolute top-2 right-2" />
      </div>
      <Link
        href={item.href}
        className="block space-y-0.5 text-sm after:absolute after:inset-0 after:rounded-2xl"
      >
        <h6 className="line-clamp-2">{item.title}</h6>
        {item.meta.map((line) => (
          <p key={line} className="truncate text-muted-foreground">
            {line}
          </p>
        ))}
        <p className="pt-0.5 font-semibold">{item.highlight}</p>
      </Link>
    </motion.article>
  );
}
