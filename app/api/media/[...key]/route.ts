import { storage } from "@/lib/storage";

/** Serves a stored business image. Only the business folder is reachable, and names are unguessable and never reused. */
export async function GET(_request: Request, { params }: RouteContext<"/api/media/[...key]">) {
  const { key: parts } = await params;
  const key = parts.join("/");
  if (!/^business\/[\w-]+\/[\w-]+\.(jpg|png|webp)$/.test(key)) return new Response("Not found", { status: 404 });

  try {
    const object = await storage.get(key);
    if (!object.Body) return new Response("Not found", { status: 404 });
    return new Response(object.Body.transformToWebStream(), {
      headers: {
        "Content-Type": object.ContentType ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
