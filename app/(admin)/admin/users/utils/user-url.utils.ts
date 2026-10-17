import { parsePage } from "@/lib/pagination";
import type { UserFilter, UserListQuery } from "@/types/admin-user";

const FILTERS: UserFilter[] = ["ALL", "USER", "BUSINESS_OWNER", "ADMIN", "SUSPENDED"];
const MAX_QUERY = 100;
const BASE = "/admin/users";

type Params = Record<string, string | string[] | undefined>;

/** Reads the search, group and page from the address, ignoring anything unexpected. */
export function parseUserQuery(params: Params): UserListQuery {
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const filter = Array.isArray(params.filter) ? params.filter[0] : params.filter;
  return {
    q: (raw ?? "").trim().slice(0, MAX_QUERY),
    filter: FILTERS.includes(filter as UserFilter) ? (filter as UserFilter) : "ALL",
    page: parsePage(params.page),
  };
}

/** The address for a search, group and page. Left out when it is the default, so the address stays short. */
export function usersHref({ q, filter, page }: Partial<UserListQuery>): string {
  const params = new URLSearchParams();
  if (q?.trim()) params.set("q", q.trim());
  if (filter && filter !== "ALL") params.set("filter", filter);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return query ? `${BASE}?${query}` : BASE;
}
