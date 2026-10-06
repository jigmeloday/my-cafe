import { Globe, Mail, MapPin, Phone } from "lucide-react";

import type {
  ActivityTab,
  BusinessContact,
  BusinessHours,
} from "../model/business.type";

export const BUSINESS_ABOUT = [
  "[Tell people what this place is, what it is known for and what to try first.]",
  "[Add a few details: the story, the team, and what makes it worth a visit.]",
];

export const BUSINESS_HOURS: BusinessHours[] = [
  { day: "Monday", hours: "9:00 am – 6:00 pm" },
  { day: "Tuesday", hours: "9:00 am – 6:00 pm" },
  { day: "Wednesday", hours: "9:00 am – 6:00 pm" },
  { day: "Thursday", hours: "9:00 am – 6:00 pm" },
  { day: "Friday", hours: "9:00 am – 8:00 pm" },
  { day: "Saturday", hours: "10:00 am – 8:00 pm" },
  { day: "Sunday", hours: "Closed" },
];

export const BUSINESS_CONTACTS: BusinessContact[] = [
  { key: "phone", icon: Phone, text: "[Phone number]" },
  { key: "email", icon: Mail, text: "[Email address]" },
  { key: "address", icon: MapPin, text: "[Street address]" },
  { key: "website", icon: Globe, text: "[Website]" },
];

export const GALLERY_ITEMS = ["Photo 1", "Photo 2", "Photo 3", "Photo 4"];

export const BUSINESS_COPY = {
  back: "New places",
  backHref: "/discover",
  about: "About",
  hours: "Opening hours",
  contact: "Contact & location",
  activity: "Offers & events",
  gallery: "Photos",
  similar: "More new places",
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

export const LIST_LIMIT = 4;
export const DEFAULT_CATEGORY = "Local business";
