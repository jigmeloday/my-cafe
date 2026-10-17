import type { AdminBusiness, BusinessFilters } from "../model/business.type";

export function filterBusinesses(
  items: AdminBusiness[],
  { query, status }: BusinessFilters,
) {
  const text = query.trim().toLowerCase();
  return items.filter(
    (b) =>
      (status === "ALL" || b.status === status) &&
      (!text ||
        [b.name, b.ownerName, b.ownerEmail].some((v) =>
          v.toLowerCase().includes(text),
        )),
  );
}

export const countByStatus = (
  items: AdminBusiness[],
  status: BusinessFilters["status"],
) =>
  status === "ALL"
    ? items.length
    : items.filter((b) => b.status === status).length;
