import { NextResponse } from "next/server";

import { KYC_KINDS, type KycDocKind } from "@/lib/kyc";
import { MAX_IMAGE_BYTES } from "@/lib/files";
import { sniffDocument } from "@/lib/media";
import { getCurrentUser } from "@/lib/session";
import { kycService } from "@/services/kyc/kyc.service";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });

/** A business owner uploads one identity document. It goes to the private bucket and is never shown publicly. */
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return fail("Please log in with a business account.", 401);

  const form = await request.formData().catch(() => null);
  const kind = form?.get("kind");
  const file = form?.get("file");
  if (typeof kind !== "string" || !KYC_KINDS.includes(kind as KycDocKind) || !(file instanceof File)) return fail("Choose a file to upload.", 400);
  if (file.size > MAX_IMAGE_BYTES) return fail("Files must be under 5 MB.", 413);

  // The file's own first bytes decide what it is, not its name or the type the browser claims.
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffDocument(bytes);
  if (!type) return fail("Use a JPG, PNG, WebP or PDF file.", 415);

  const result = await kycService.uploadDocument(user, kind as KycDocKind, bytes, type);
  if (!result.ok) return fail(result.error, 400);
  // Only the key comes back: the file can't be fetched again by the owner or anyone but an admin.
  return NextResponse.json({ key: result.key }, { headers: { "Cache-Control": "no-store" } });
}
