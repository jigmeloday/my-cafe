export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const IMAGE_NAME = /\.(jpe?g|png|webp)$/i;

/**
 * Returns an error message, or null when the file looks like an acceptable image.
 * Some files arrive without a type (for example one still being downloaded from the cloud), so a good
 * file name is accepted too. The server checks the real contents, so this is only a first look.
 */
export function validateImage(file: File): string | null {
  const looksLikeImage = file.type.startsWith("image/") || (!file.type && IMAGE_NAME.test(file.name));
  if (!looksLikeImage) return "Choose an image file (JPG, PNG or WebP).";
  if (file.size > MAX_IMAGE_BYTES) return "Images must be under 5 MB.";
  return null;
}
