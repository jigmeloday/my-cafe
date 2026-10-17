import type { MediaKind } from "@/lib/media";

/** Sends one image to the server. Resolves with the stored image, or throws an Error with a message to show. */
export async function uploadBusinessImage(kind: MediaKind, file: File): Promise<{ key: string; url: string }> {
  const form = new FormData();
  form.set("kind", kind);
  form.set("file", file);
  const response = await fetch("/api/business/media", { method: "POST", body: form });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "The upload failed. Please try again.");
  return body;
}

export async function removeBusinessImage(kind: MediaKind, key = ""): Promise<void> {
  const response = await fetch("/api/business/media", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, key }),
  });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error ?? "We couldn't remove that image.");
}
