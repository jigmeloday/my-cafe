/**
 * Returns `next` only when it is a path on this site (e.g. "/business/promotions").
 * Anything else ("https://evil.example", "//evil.example", "/\\evil.example") is ignored,
 * so a login link can't be used to send people to another website.
 */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return null;
  if (/[\u0000-\u001f]/.test(next)) return null;
  return next;
}
