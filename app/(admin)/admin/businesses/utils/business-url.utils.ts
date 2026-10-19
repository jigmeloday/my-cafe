import { parsePage } from "@/lib/pagination";
import type { BusinessFilter, BusinessListQuery } from "@/types/admin-business";

const FILTERS: BusinessFilter[] = ["ALL", "PENDING", "VERIFIED", "SUSPENDED"];
const BASE = "/admin/businesses";

type Params = Record<string, string | string[] | undefined>;

/** Reads the search, group and page from the address, ignoring anything unexpected. */
export function parseBusinessQuery(params: Params): BusinessListQuery {
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const filter = Array.isArray(params.filter) ? params.filter[0] : params.filter;
  return {
    q: (raw ?? "").trim().slice(0, 100),
    filter: FILTERS.includes(filter as BusinessFilter) ? (filter as BusinessFilter) : "ALL",
    page: parsePage(params.page),
  };
}

/** The address for a search, group and page. Left out when it is the default, so the address stays short. */
export function businessesHref({ q, filter, page }: Partial<BusinessListQuery>): string {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (filter && filter !== "ALL") params.set("filter", filter);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${BASE}?${query}` : BASE;
}
