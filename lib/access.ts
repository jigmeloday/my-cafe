import type { Role } from "@/generated/prisma/enums";

/**
 * Who may see which part of the site. One table, so every guard (layouts, pages, tests) agrees.
 *
 * - admin:    the admin area. Anyone else gets a 404, so the area's existence isn't revealed.
 * - business: the business dashboard. Business owners only.
 * - customer: the customer profile. Customers and admins; business owners use their own dashboard instead.
 * - public:   the discovery site. Business owners are kept in their dashboard (they preview their own page there).
 * - auth:     log in / sign up pages. Pointless once signed in, so signed-in people go home.
 */
export type Area = "admin" | "business" | "customer" | "public" | "auth";

export const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  BUSINESS_OWNER: "/business/dashboard",
  USER: "/profile",
};

export type Decision = { action: "allow" } | { action: "login" } | { action: "redirect"; to: string } | { action: "notFound" };

const ALLOW: Decision = { action: "allow" };

/** What should happen when `role` (null = signed out) asks for something in `area`. */
export function decide(role: Role | null, area: Area): Decision {
  switch (area) {
    case "admin":
      if (role === "ADMIN") return ALLOW;
      return role === null ? { action: "login" } : { action: "notFound" };
    case "business":
      if (role === "BUSINESS_OWNER") return ALLOW;
      return role === null ? { action: "login" } : { action: "redirect", to: HOME_BY_ROLE[role] };
    case "customer":
      if (role === "USER" || role === "ADMIN") return ALLOW;
      return role === null ? { action: "login" } : { action: "redirect", to: HOME_BY_ROLE[role] };
    case "public":
      return role === "BUSINESS_OWNER" ? { action: "redirect", to: HOME_BY_ROLE[role] } : ALLOW;
    case "auth":
      return role === null ? ALLOW : { action: "redirect", to: HOME_BY_ROLE[role] };
  }
}
