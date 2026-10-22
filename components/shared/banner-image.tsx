import { cn } from "@/lib/utils";

/**
 * A banner picture shown whole, never cropped, whatever its shape. Whatever the picture doesn't fill is covered by a
 * soft blurred copy of itself, so a tall photo or a small logo still looks intentional in a wide banner.
 */
export function BannerImage({ src, className }: { src: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden className="absolute inset-0 size-full scale-125 object-cover opacity-70 blur-2xl" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="relative size-full object-contain" />
    </div>
  );
}
