export const ELLIPSIS = "…" as const;
export type PageItem = number | typeof ELLIPSIS;

/** Reads a page number from the address. Anything that isn't a whole number of at least 1 becomes 1. */
export function parsePage(value: string | string[] | undefined): number {
  const text = Array.isArray(value) ? value[0] : value;
  if (!text || !/^\d{1,9}$/.test(text)) return 1;
  return Math.max(1, Number(text));
}

export const totalPagesFor = (total: number, pageSize: number) => Math.max(1, Math.ceil(total / pageSize));

/** Keeps a page number inside 1..totalPages. */
export const clampPage = (page: number, totalPages: number) => Math.min(Math.max(1, page), Math.max(1, totalPages));

/** The "Showing 11–20 of 47" range. Both ends are 0 when there is nothing to show. */
export function pageRange(page: number, pageSize: number, total: number) {
  if (total === 0) return { from: 0, to: 0 };
  return { from: (page - 1) * pageSize + 1, to: Math.min(page * pageSize, total) };
}

/**
 * Page numbers to show, with "…" for gaps: always the first and last page, plus the pages around the
 * current one. Short lists show every page. e.g. 1 … 4 5 6 … 20
 */
export function pageWindow(current: number, totalPages: number, siblings = 1): PageItem[] {
  const visible = siblings * 2 + 5; // first, last, current, siblings, and two gaps
  if (totalPages <= visible) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const left = Math.max(current - siblings, 2);
  const right = Math.min(current + siblings, totalPages - 1);
  const items: PageItem[] = [1];

  if (left > 2) items.push(left === 3 ? 2 : ELLIPSIS);
  for (let page = left; page <= right; page++) items.push(page);
  if (right < totalPages - 1) items.push(right === totalPages - 2 ? totalPages - 1 : ELLIPSIS);

  items.push(totalPages);
  return items;
}
