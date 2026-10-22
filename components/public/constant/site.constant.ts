import {
  Baby,
  BedDouble,
  CalendarDays,
  Coffee,
  House,
  Leaf,
  Shirt,
  Smartphone,
  Sparkles,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

import type { CategoryItem, FooterColumn, NavLink } from "../model/site.type";

export const SITE_NAME = "Nook";
export const SITE_LOCALE = "English (BT)";
export const SITE_CURRENCY = "Nu. BTN";

export const MAIN_NAV: NavLink[] = [
  { label: "Deals", href: "/deals" },
  { label: "Events", href: "/events" },
  { label: "New places", href: "/discover" },
];

export const SIGNED_IN_MENU = {
  account: { label: "My account", href: "/profile" },
  /** Business owners manage a business profile, not a customer one. */
  accounts: {
    BUSINESS_OWNER: { label: "Business profile", href: "/business/profile" },
  } as Record<string, NavLink>,
  dashboards: {
    BUSINESS_OWNER: { label: "Business dashboard", href: "/business/dashboard" },
    ADMIN: { label: "Admin", href: "/admin/dashboard" },
  } as Record<string, NavLink>,
  logout: "Log out",
};

export const USER_MENU: NavLink[] = [
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/register" },
  { label: "Advertise your business", href: "/business" },
];

export const CATEGORIES: CategoryItem[] = [
  { label: "Festival", href: "/categories/festival", icon: Sparkles },
  { label: "Food", href: "/categories/food", icon: UtensilsCrossed },
  { label: "Cafés", href: "/categories/cafes", icon: Coffee },
  { label: "Fashion", href: "/categories/fashion", icon: Shirt },
  { label: "Phones", href: "/categories/phones", icon: Smartphone },
  { label: "Stays", href: "/categories/stays", icon: BedDouble },
  { label: "Wellness", href: "/categories/wellness", icon: Leaf },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Kids", href: "/categories/kids", icon: Baby },
  { label: "Home", href: "/categories/home", icon: House },
  { label: "Services", href: "/categories/services", icon: Wrench },
];

export const SEARCH_FIELDS = [
  { name: "what", label: "What", placeholder: "Search deals, places, events" },
  { name: "where", label: "Where", placeholder: "Thimphu" },
  { name: "when", label: "When", placeholder: "Any time" },
] as const;

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Report a listing", href: "/report" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    title: "Businesses",
    links: [
      { label: "List your business", href: "/business" },
      { label: "Business dashboard", href: "/business/dashboard" },
    ],
  },
  {
    title: SITE_NAME,
    links: [
      { label: "About", href: "/about" },
      { label: "What's coming", href: "/coming-soon" },
      { label: "Careers", href: "/careers" },
      { label: "Terms and conditions", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ],
  },
];
