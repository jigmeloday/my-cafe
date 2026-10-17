"use client";

import { Heart } from "lucide-react";

import { useEngagement } from "@/components/engagement/engagement-provider";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  /** The page address of the promotion, e.g. "/promotions/pizza-fridays". */
  href: string;
  /** Shown until the real state has loaded, for pages that already know (like your Favorites). */
  defaultSaved?: boolean;
  className?: string;
}

export function FavoriteButton({ href, defaultSaved = false, className }: FavoriteButtonProps) {
  const { ready, isFavorite, toggleFavorite } = useEngagement();
  const saved = ready ? isFavorite(href) : defaultSaved;

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      onClick={() => toggleFavorite(href)}
      className={cn(
        "grid size-8 place-items-center rounded-full text-foreground/70 transition-transform hover:scale-110 active:scale-95",
        className
      )}
    >
      <Heart className={cn("size-5", saved && "fill-primary text-primary")} />
    </button>
  );
}
