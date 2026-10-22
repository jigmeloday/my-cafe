import "server-only";

import sharp from "sharp";

import type { MediaKind } from "@/lib/media";

/** The widest each kind of picture is ever shown (in pixels, allowing for sharp screens). Wider pictures are scaled down. */
const MAX_WIDTH: Record<MediaKind, number> = { logo: 600, cover: 2400, gallery: 1800, promotion: 1800, banner: 2400 };

/** Pictures with more pixels than this are refused, so one upload can't use up the server's memory. */
const MAX_PIXELS = 50_000_000;

export interface OptimizedImage {
  bytes: Uint8Array;
  ext: "webp";
  mime: "image/webp";
}

/**
 * Makes an uploaded picture small enough to load fast: turned upright, scaled down to the size it is shown at, and
 * saved as WebP. A 5 MB photo usually becomes a few hundred KB, which is what every visitor then downloads.
 * Returns null when the picture can't be read or processed, and the caller decides what to do.
 */
export async function optimizeImage(bytes: Uint8Array, kind: MediaKind): Promise<OptimizedImage | null> {
  try {
    const out = await sharp(bytes, { limitInputPixels: MAX_PIXELS })
      .rotate()
      .resize({ width: MAX_WIDTH[kind], withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    return { bytes: new Uint8Array(out), ext: "webp", mime: "image/webp" };
  } catch (error) {
    console.error("[image] Couldn't optimise an upload:", (error as Error).message);
    return null;
  }
}
