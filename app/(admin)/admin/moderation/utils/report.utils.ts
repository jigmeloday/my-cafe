import type { Report, ReportFilter } from "../model/report.type";

export function filterReports(
  items: Report[],
  filter: ReportFilter,
  query: string,
) {
  const text = query.trim().toLowerCase();
  return items.filter(
    (r) =>
      (filter === "ALL" || r.status === filter) &&
      (!text ||
        r.promotionTitle.toLowerCase().includes(text) ||
        r.businessName.toLowerCase().includes(text)),
  );
}

export const countFor = (items: Report[], filter: ReportFilter) =>
  filter === "ALL"
    ? items.length
    : items.filter((r) => r.status === filter).length;
