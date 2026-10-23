import { Globe, Link2, Mail, MapPin, Phone } from "lucide-react";

import type { ActivityTab } from "../model/business.type";

export const CONTACT_ICONS = { phone: Phone, email: Mail, address: MapPin, website: Globe, social: Link2 } as const;

export const BUSINESS_COPY = {
  back: "New places",
  backHref: "/discover",
  about: "About",
  hours: "Opening hours",
  contact: "Contact & location",
  activity: "Offers & events",
  gallery: "Photos",
  similar: "More new places",
  editProfile: "Edit profile",
  services: "Services",
  products: "Products",
  openingOffer: "Opening offer",
  closed: "Closed",
  today: "Today",
};

export const ACTIVITY_TABS: ActivityTab[] = [
  {
    id: "current",
    label: "Current",
    emptyTitle: "Nothing on right now",
    emptyDescription: "Check Upcoming to see what's coming next.",
  },
  {
    id: "upcoming",
    label: "Upcoming",
    emptyTitle: "Nothing scheduled yet",
    emptyDescription: "Follow this place to hear about new offers and events.",
  },
  {
    id: "past",
    label: "Past",
    emptyTitle: "No past offers or events",
    emptyDescription: "Offers and events that have ended will show here.",
  },
];


/** How wide a business cover picture is shown: the page width, up to the page's widest. */
export const COVER_SIZES = "(min-width: 1280px) 1200px, 100vw";
