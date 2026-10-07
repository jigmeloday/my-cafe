export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

/** Returns an error message, or null when the file is an acceptable image. */
export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/"))
    return "Choose an image file (JPG, PNG or WebP).";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be under 5 MB.";
  return null;
}
