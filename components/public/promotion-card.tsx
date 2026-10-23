"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { BannerImage } from "@/components/shared/banner-image";
import { FavoriteButton } from "@/components/shared/favorite-button";
import { ImagePlaceholder } from "@/components/shared/image-placeholder";
import { canOptimize } from "@/lib/images";
import { cn } from "@/lib/utils";

import { SQUARE_SIZES, WIDE_SIZES } from "./constant/promotion.constant";
import type { PromotionCardData } from "./model/promotion.type";

export function PromotionCard({
  item,
  className,
  defaultSaved,
}: {
  item: PromotionCardData;
  className?: string;
  /** Show the heart as saved until the real state loads (for lists of things already saved). */
  defaultSaved?: boolean;
}) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("relative w-full space-y-2", className)}
    >
      <div className="relative">
        {item.wide ? (
          // A business's picture is usually wide (a cover) or small (a logo): show it whole, never cropped.
          item.imageUrl ? (
            <BannerImage src={item.imageUrl} sizes={WIDE_SIZES} className="aspect-video rounded-2xl" />
          ) : (
            <ImagePlaceholder className="aspect-video rounded-2xl" />
          )
        ) : item.imageUrl ? (
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <Image src={item.imageUrl} alt="" fill sizes={SQUARE_SIZES} unoptimized={!canOptimize(item.imageUrl)} className="object-cover" />
          </div>
        ) : (
          <ImagePlaceholder className="aspect-square rounded-2xl" />
        )}
        {item.badge && (
          <span className="absolute top-3 left-3 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold shadow-sm">
            {item.badge}
          </span>
        )}
        {item.canSave !== false && <FavoriteButton href={item.href} defaultSaved={defaultSaved} className="absolute top-2 right-2 z-10" />}
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
