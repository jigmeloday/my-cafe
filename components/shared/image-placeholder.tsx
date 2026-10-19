import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** Shown where a photo hasn't been added yet: a quiet grey block with a small picture icon. */
export function ImagePlaceholder({ label = "Photo", className }: { label?: string; className?: string }) {
  return (
    <div role="img" aria-label={label} className={cn("grid place-items-center bg-muted text-muted-foreground/50", className)}>
      <ImageIcon className="size-1/4 max-h-8 min-h-4 max-w-8 min-w-4" aria-hidden />
    </div>
  );
}
