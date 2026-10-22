import sharp from "sharp";

const MAX_SIDE = 1600;

/** Shrinks an upload to a web-sized WebP, so pages don't download a multi-megabyte original. */
export async function optimizeImage(bytes: Uint8Array) {
  const out = await sharp(bytes).rotate().resize({ width: MAX_SIDE, height: MAX_SIDE, fit: "inside", withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  return { bytes: new Uint8Array(out), image: { ext: "webp", mime: "image/webp" } };
}
