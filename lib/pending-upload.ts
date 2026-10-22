import type { MediaKind } from "@/lib/media";
import { removeBusinessImage, uploadBusinessImage } from "@/lib/upload-client";

/**
 * Stands in for an image key while a picture is chosen but not yet sent. It lets a form's checks pass ("an image is
 * needed") without uploading anything. The real key replaces it when the form is saved.
 */
export const PENDING_IMAGE = "pending-upload";

/** Deletes files that were sent but never saved. Best effort: a failure here must not hide the real result. */
export async function discardUploads(kind: MediaKind, keys: string[]): Promise<void> {
  await Promise.allSettled(keys.map((key) => removeBusinessImage(kind, key)));
}

/**
 * Sends the chosen pictures, one after another, only when the person saves. Resolves with their keys in order.
 * If one fails, the ones already sent are deleted again and the error is thrown, so nothing is left behind.
 */
export async function uploadChosen(kind: MediaKind, files: File[]): Promise<string[]> {
  const keys: string[] = [];
  try {
    for (const file of files) keys.push((await uploadBusinessImage(kind, file)).key);
    return keys;
  } catch (error) {
    await discardUploads(kind, keys);
    throw error;
  }
}
