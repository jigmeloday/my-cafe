import { CalendarDays, CircleHelp, MapPin, Tag } from "lucide-react";

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
