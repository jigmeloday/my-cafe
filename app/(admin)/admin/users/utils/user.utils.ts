import type { AdminUser, UserFilter, UserFilters } from "../model/user.type";

const matches = (user: AdminUser, filter: UserFilter) =>
  filter === "ALL" ||
  (filter === "SUSPENDED" ? user.status === "SUSPENDED" : user.role === filter);

export function filterUsers(
  items: AdminUser[],
  { query, filter }: UserFilters,
) {
  const text = query.trim().toLowerCase();
  return items.filter(
    (u) =>
      matches(u, filter) &&
      (!text ||
        u.name.toLowerCase().includes(text) ||
        u.email.toLowerCase().includes(text)),
  );
}

export const countFor = (items: AdminUser[], filter: UserFilter) =>
  items.filter((u) => matches(u, filter)).length;

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
