import type { NavIconName } from "../icons";

export interface DashboardNavItem {
  label: string;
  href: string;
  /** A key of `NAV_ICONS`. */
  icon: NavIconName;
}
