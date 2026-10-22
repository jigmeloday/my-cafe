import type { DashboardNavItem } from "@/components/dashboard/model/nav.type";

export const ADMIN_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Businesses", href: "/admin/businesses", icon: "Store" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Wallets", href: "/admin/wallets", icon: "Wallet" },
  { label: "Banners", href: "/admin/banners", icon: "Megaphone" },
  { label: "Categories", href: "/admin/categories", icon: "Tag" },
  { label: "Verification", href: "/admin/verification", icon: "ShieldCheck" },
  { label: "Messages", href: "/admin/messages", icon: "Mail" },
  { label: "Moderation", href: "/admin/moderation", icon: "ShieldAlert" },
];

export const ADMIN_SHELL = {
  title: "Admin",
  siteHref: "/",
};
