import "server-only";

import sharp from "sharp";

import { storage } from "@/lib/storage";

const MEDIA_PREFIX = "/api/media/";
const STORED_KEY = /^business\/[\w-]+\/[\w-]+\.(jpg|png|webp)$/;

/** A stored photo, cropped to a story's shape and inlined, so the picture renderer needs no network. Null when there is none. */
export async function storyPhoto(url?: string): Promise<string | null> {
  const key = url?.startsWith(MEDIA_PREFIX) ? url.slice(MEDIA_PREFIX.length) : "";
  if (!STORED_KEY.test(key)) return null;
  try {
    const bytes = await (await storage.get(key)).Body?.transformToByteArray();
    if (!bytes) return null;
    const jpeg = await sharp(bytes).resize(1080, 1920, { fit: "cover" }).jpeg({ quality: 85 }).toBuffer();
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}
