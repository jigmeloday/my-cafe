import { NextResponse } from "next/server";

import { MAX_IMAGE_BYTES } from "@/lib/files";
import { optimizeImage } from "@/lib/image-optimize";
import { MEDIA_KINDS, mediaUrl, sniffImage, type MediaKind } from "@/lib/media";
import { getCurrentUser } from "@/lib/session";
import { businessMediaService } from "@/services/business/business-media.service";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

async function sender() {
  const user = await getCurrentUser();
  return user?.role === "BUSINESS_OWNER" || user?.role === "ADMIN" ? user : null;
}

const isKind = (value: unknown): value is MediaKind => MEDIA_KINDS.includes(value as MediaKind);

/** Adds a logo, cover or gallery photo for the signed-in business. An admin can only add banner pictures, for a business they name. */
export async function POST(request: Request) {
  const user = await sender();
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

  if (user.role === "ADMIN") {
    const businessId = form?.get("businessId");
    if (kind !== "banner" || typeof businessId !== "string") return fail("Admins can only add banner pictures for a business.", 403);
    const added = await businessMediaService.addBannerFile(businessId, small.bytes, small);
    return added.ok ? NextResponse.json({ key: added.key, url: mediaUrl(added.key) }) : fail(added.error, 400);
  }

  const result = await businessMediaService.add(user, kind, small.bytes, small);
  if (!result.ok) return fail(result.error, 400);
  return NextResponse.json({ key: result.key, url: mediaUrl(result.key) });
}

/** Removes the logo or cover, or one gallery photo (named by its key). */
export async function DELETE(request: Request) {
  const user = await sender();
  if (!user) return fail("Please log in with a business account.", 401);

  const body = await request.json().catch(() => null);
  if (!isKind(body?.kind)) return fail("Nothing to remove.", 400);
  if (user.role === "ADMIN") {
    if (body.kind !== "banner" || typeof body.businessId !== "string") return fail("Admins can only remove banner pictures.", 403);
    await businessMediaService.removeBannerFile(body.businessId, typeof body.key === "string" ? body.key : "");
    return NextResponse.json({ ok: true });
  }

  const result = await businessMediaService.remove(user, body.kind, typeof body.key === "string" ? body.key : "");
  return result.ok ? NextResponse.json({ ok: true }) : fail(result.error, 400);
}
