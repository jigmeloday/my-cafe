import Image from "next/image";

import { canOptimize } from "@/lib/images";
import { cn } from "@/lib/utils";

interface BannerImageProps {
  src: string;
  className?: string;
  /** How wide the picture is shown at different screen sizes, so a phone isn't sent a desktop-sized file. */
  sizes?: string;
  /** Load it straight away, for the first picture on a page. */
  eager?: boolean;
}

/**
 * A banner picture shown whole, never cropped, whatever its shape. Whatever the picture doesn't fill is covered by a
 * soft blurred copy of itself, so a tall photo or a small logo still looks intentional in a wide banner.
 */
export function BannerImage({ src, className, sizes = "100vw", eager }: BannerImageProps) {
  const unoptimized = !canOptimize(src);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* The blurred copy is tiny: it is blurred away anyway, so it asks for a small file. */}
      <Image src={src} alt="" aria-hidden fill sizes="160px" unoptimized={unoptimized} className="scale-125 object-cover opacity-70 blur-2xl" />
      <Image src={src} alt="" fill sizes={sizes} unoptimized={unoptimized} loading={eager ? "eager" : "lazy"} className="object-cover" />
    </div>
  );
}
