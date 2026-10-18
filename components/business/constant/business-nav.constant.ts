import type { DashboardNavItem } from "@/components/dashboard/model/nav.type";

export const BUSINESS_NAV: DashboardNavItem[] = [
  { label: "Overview", href: "/business/dashboard", icon: "LayoutDashboard" },
  { label: "Business profile", href: "/business/profile", icon: "Store" },
  { label: "Promotions", href: "/business/promotions", icon: "Tag" },
  { label: "Banners", href: "/business/banners", icon: "Megaphone" },
  { label: "Wallet", href: "/business/wallet", icon: "Wallet" },
  { label: "Transactions", href: "/business/transactions", icon: "Receipt" },
  { label: "Analytics", href: "/business/analytics", icon: "ChartColumn" },
];

export const BUSINESS_SHELL = {
  businessName: "[Business name]",
  viewPublic: "Preview public page",
  walletHref: "/business/wallet",
  /** Sample balance, in coins. */
  walletCoins: 1250,
};
