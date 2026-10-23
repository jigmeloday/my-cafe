import Image from "next/image";

import { canOptimize } from "@/lib/images";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: string;
  /** Leave empty for a picture that only decorates; describe it when it carries meaning. */
  alt?: string;
  /** How wide the picture is shown at different screen sizes, so each device downloads the right size. */
  sizes: string;
  /** Sets the frame: its size and shape (`size-12 rounded-full`, `aspect-square`, `h-44 w-full`). */
  className?: string;
  /** "cover" fills the frame and crops; "contain" shows the whole picture. */
  fit?: "cover" | "contain";
  /** Load it straight away, for the first picture on a page. */
  eager?: boolean;
  /** Serve the file as it is, for pictures that must not go through the optimizer (private documents). */
  unoptimized?: boolean;
}

/**
 * A picture in a frame, using `next/image`. The frame sets the size; the picture fills it. Pictures that Next.js
 * can't fetch itself (a preview of a file just chosen, or another site's) are shown as they are.
 */
export function Photo({ src, alt = "", sizes, className, fit = "cover", eager, unoptimized }: PhotoProps) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        unoptimized={unoptimized || !canOptimize(src)}
        loading={eager ? "eager" : "lazy"}
        className={fit === "cover" ? "object-cover" : "object-contain"}
      />
    </div>
  );
}
