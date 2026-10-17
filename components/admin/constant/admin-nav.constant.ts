import type { DashboardNavItem } from "@/components/dashboard/model/nav.type";

export const ADMIN_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Businesses", href: "/admin/businesses", icon: "Store" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Moderation", href: "/admin/moderation", icon: "ShieldAlert" },
];

export const ADMIN_SHELL = {
  title: "Admin",
  siteHref: "/",
};
