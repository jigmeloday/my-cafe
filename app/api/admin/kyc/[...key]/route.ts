import { KYC_KEY_PATTERN } from "@/lib/kyc";
import { getCurrentUser } from "@/lib/session";
import { kycService } from "@/services/kyc/kyc.service";

const notFound = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

/**
 * Opens an identity document for an admin. Admins only (everyone else gets a plain 404), only files that belong
 * to a real request, never cached, never run as a page, and every opening is written to the audit log.
 */
export async function GET(_request: Request, { params }: RouteContext<"/api/admin/kyc/[...key]">) {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return notFound();

  const { key: parts } = await params;
  const key = parts.join("/");
  if (!KYC_KEY_PATTERN.test(key)) return notFound();

  try {
    const object = await kycService.openDocument({ id: user.id, email: user.email }, key);
    if (!object?.Body) return notFound();
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
        // The file is shown on its own and can't run anything or load anything else.
        "Content-Security-Policy": "default-src 'none'; img-src 'self' data:; style-src 'unsafe-inline'; sandbox",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return notFound();
  }
}
