/**
 * Whether Next.js can resize and cache this picture. Pictures stored by Nook (a path like /api/media/...) can.
 * One still on the person's device (a preview, "blob:") or on another site can't, so it is shown as it is.
 */
export const canOptimize = (src: string) => src.startsWith("/") && !src.startsWith("//");
