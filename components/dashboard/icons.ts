import {
  ChartColumn,
  LayoutDashboard,
  Megaphone,
  Receipt,
  ShieldAlert,
  Store,
  Tag,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Icons the dashboard menus can use. Menus name an icon as a string (e.g. "Wallet") instead of
 * passing a component, because components can't be passed from server layouts to client menus.
 * Add an icon here before using its name in a nav list.
 */
export const NAV_ICONS = {
  ChartColumn,
  LayoutDashboard,
  Megaphone,
  Receipt,
  ShieldAlert,
  Store,
  Tag,
  Users,
  Wallet,
} as const;

export type NavIconName = keyof typeof NAV_ICONS;
