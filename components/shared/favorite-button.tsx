"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

export function FavoriteButton({ className }: { className?: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save"}
      onClick={() => setSaved((v) => !v)}
      className={cn(
        "grid size-8 place-items-center rounded-full text-foreground/70 transition-transform hover:scale-110 active:scale-95",
        className,
      )}
    >
      <Heart className={cn("size-5", saved && "fill-primary text-primary")} />
    </button>
  );
}
