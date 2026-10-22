import { BarChart3, CalendarDays, CircleHelp, Megaphone, MapPin, Store, Tag, Users, Wallet } from "lucide-react";

export const NOT_FOUND_COPY = {
  title: "We couldn't find that page",
  text: "The link may be old or mistyped, or the page may have moved or ended. Let's get you back to what's on.",
  home: "Go to home",
  deals: "Browse deals",
  moreTitle: "Or look around",
};

export const NOT_FOUND_LINKS = [
  { icon: Tag, label: "Deals", text: "Offers from local businesses", href: "/deals" },
  { icon: CalendarDays, label: "Events", text: "What's happening soon", href: "/events" },
  { icon: MapPin, label: "New places", text: "Recently opened near you", href: "/discover" },
  { icon: CircleHelp, label: "Help centre", text: "Answers and ways to reach us", href: "/help" },
];

export type NotFoundArea = "site" | "business" | "admin";

/** Where the page sends people, by who is looking: visitors get the public site, owners and admins their own area. */
export const NOT_FOUND_AREAS: Record<NotFoundArea, { home: string; homeLabel: string; second: { href: string; label: string }; moreTitle: string; links: typeof NOT_FOUND_LINKS }> = {
  site: { home: "/", homeLabel: NOT_FOUND_COPY.home, second: { href: "/deals", label: NOT_FOUND_COPY.deals }, moreTitle: NOT_FOUND_COPY.moreTitle, links: NOT_FOUND_LINKS },
  business: {
    home: "/business/dashboard",
    homeLabel: "Back to your dashboard",
    second: { href: "/business/promotions", label: "Your promotions" },
    moreTitle: "Or jump to",
    links: [
      { icon: Tag, label: "Promotions", text: "Create and manage your deals", href: "/business/promotions" },
      { icon: Megaphone, label: "Banners", text: "Home page banners", href: "/business/banners" },
      { icon: Wallet, label: "Wallet", text: "Your coins and activity", href: "/business/wallet" },
      { icon: BarChart3, label: "Analytics", text: "Views, clicks and followers", href: "/business/analytics" },
    ],
  },
  admin: {
    home: "/admin/dashboard",
    homeLabel: "Back to the overview",
    second: { href: "/admin/businesses", label: "Businesses" },
    moreTitle: "Or jump to",
    links: [
      { icon: Store, label: "Businesses", text: "Verify and manage businesses", href: "/admin/businesses" },
      { icon: Users, label: "Users", text: "Customers and owners", href: "/admin/users" },
      { icon: Megaphone, label: "Banners", text: "Review and create banners", href: "/admin/banners" },
      { icon: Wallet, label: "Wallets", text: "Add coins to a business", href: "/admin/wallets" },
    ],
  },
};
