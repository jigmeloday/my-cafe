import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface CategoryItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}
