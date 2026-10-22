import { NextResponse } from "next/server";

import { MAX_IMAGE_BYTES } from "@/lib/files";
import { optimizeImage } from "@/lib/image-optimize";
import { MEDIA_KINDS, mediaUrl, sniffImage, type MediaKind } from "@/lib/media";
import { getCurrentUser } from "@/lib/session";
import { businessMediaService } from "@/services/business/business-media.service";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

async function owner() {
  const user = await getCurrentUser();
  return user?.role === "BUSINESS_OWNER" ? user : null;
}

const isKind = (value: unknown): value is MediaKind => MEDIA_KINDS.includes(value as MediaKind);

/** Adds a logo, cover or gallery photo for the signed-in business. */
export async function POST(request: Request) {
  const user = await owner();
  if (!user) return fail("Please log in with a business account.", 401);

  const form = await request.formData().catch(() => null);
  const kind = form?.get("kind");
  const file = form?.get("file");
  if (!isKind(kind) || !(file instanceof File)) return fail("Choose an image to upload.", 400);
  if (file.size > MAX_IMAGE_BYTES) return fail("Images must be under 5 MB.", 413);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffImage(bytes);
  if (!type) return fail("Use a JPG, PNG or WebP image.", 415);

  // Stored small: what visitors download is this file, so a 5 MB photo is scaled down and saved as WebP.
  const small = await optimizeImage(bytes, kind);
  if (!small) return fail("We couldn't read that image. Try another one.", 415);
  const result = await businessMediaService.add(user, kind, small.bytes, small);
  if (!result.ok) return fail(result.error, 400);
  return NextResponse.json({ key: result.key, url: mediaUrl(result.key) });
}

/** Removes the logo or cover, or one gallery photo (named by its key). */
export async function DELETE(request: Request) {
  const user = await owner();
  if (!user) return fail("Please log in with a business account.", 401);

  const body = await request.json().catch(() => null);
  if (!isKind(body?.kind)) return fail("Nothing to remove.", 400);

  const result = await businessMediaService.remove(user, body.kind, typeof body.key === "string" ? body.key : "");
  return result.ok ? NextResponse.json({ ok: true }) : fail(result.error, 400);
}
