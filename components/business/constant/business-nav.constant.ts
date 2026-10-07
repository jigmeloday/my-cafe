import {
  ChartColumn,
  LayoutDashboard,
  Megaphone,
  Receipt,
  Store,
  Tag,
  Wallet,
} from "lucide-react";

import type { BusinessNavItem } from "../model/business-nav.type";

export const BUSINESS_NAV: BusinessNavItem[] = [
  { label: "Overview", href: "/business/dashboard", icon: LayoutDashboard },
  { label: "Business profile", href: "/business/profile", icon: Store },
  { label: "Promotions", href: "/business/promotions", icon: Tag },
  { label: "Campaigns", href: "/business/campaigns", icon: Megaphone },
  { label: "Wallet", href: "/business/wallet", icon: Wallet },
  { label: "Transactions", href: "/business/transactions", icon: Receipt },
  { label: "Analytics", href: "/business/analytics", icon: ChartColumn },
];

export const BUSINESS_SHELL = {
  businessName: "[Business name]",
  publicHref: "/businesses/restaurant",
  viewPublic: "View public page",
  walletHref: "/business/wallet",
  /** Sample balance, in coins. */
  walletCoins: 1250,
};
