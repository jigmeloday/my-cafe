import { Clock, Globe, MapPin, Phone } from "lucide-react";

import type { DetailKind, DetailKindConfig } from "../model/detail.type";

export const GALLERY_LABELS = [
  "Photo 1",
  "Photo 2",
  "Photo 3",
  "Photo 4",
  "Photo 5",
];
export const RELATED_COUNT = 4;

export const DETAIL_KINDS: Record<DetailKind, DetailKindConfig> = {
  promotion: {
    backLabel: "All deals",
    backHref: "/deals",
    asideLabel: "Offer",
    asideNote: "Visit the business to take up this offer.",
    factLabels: ["Offer", "Valid", "Where", "Business"],
    relatedTitle: "More deals you might like",
    description: [
      "[Describe the offer — what is included, who it is for and why it is worth a visit.]",
      "[Add any terms: opening hours, limits per customer, items excluded.]",
    ],
  },
  event: {
    backLabel: "All events",
    backHref: "/events",
    asideLabel: "Entry",
    asideNote: "Check the date and venue, then go along and enjoy.",
    factLabels: ["Date", "Venue", "Entry", "Area"],
    relatedTitle: "More events",
    description: [
      "[Describe the event — the programme, who it is for and what to expect.]",
      "[Add practical details: arrival time, what to bring, accessibility.]",
    ],
  },
};

export const META_SEPARATOR = " · ";

export const SHOP_DETAILS = [
  { key: "hours", icon: Clock, text: "[Opening hours]" },
  { key: "phone", icon: Phone, text: "[Phone number]" },
  { key: "address", icon: MapPin, text: "[Street address]" },
  { key: "website", icon: Globe, text: "[Website]" },
] as const;

export const SHOP_LABEL = "About the shop";
