/** Where a stored image is shown from. Empty key means "no image". */
export const mediaUrl = (key: string) => (key ? `/api/media/${key}` : "");

export const MAX_GALLERY = 8;
export const MEDIA_KINDS = ["logo", "cover", "gallery"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

const TYPES = {
  jpeg: { ext: "jpg", mime: "image/jpeg" },
  png: { ext: "png", mime: "image/png" },
  webp: { ext: "webp", mime: "image/webp" },
} as const;

/** The real type of an image, read from its first bytes. The name and declared type can be faked, these can't. */
export function sniffImage(bytes: Uint8Array): (typeof TYPES)[keyof typeof TYPES] | null {
  const is = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (is(0xff, 0xd8, 0xff)) return TYPES.jpeg;
  if (is(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return TYPES.png;
  if (is(0x52, 0x49, 0x46, 0x46) && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) return TYPES.webp;
  return null;
}
