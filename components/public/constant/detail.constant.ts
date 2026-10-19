import { Clock, Globe, MapPin, Phone } from "lucide-react";

import type { DetailKind, DetailKindConfig } from "../model/detail.type";

export const DETAIL_KINDS: Record<DetailKind, DetailKindConfig> = {
  promotion: {
    backLabel: "All deals",
    backHref: "/deals",
    asideLabel: "Offer",
    asideNote: "Visit the business to take up this offer.",
    factLabels: ["Offer", "Valid", "Where", "Business"],
    relatedTitle: "More deals you might like",
  },
  event: {
    backLabel: "All events",
    backHref: "/events",
    asideLabel: "Entry",
    asideNote: "Check the date and venue, then go along and enjoy.",
    factLabels: ["Date", "Venue", "Entry", "Area"],
    relatedTitle: "More events",
  },
};

export const SHOP_LINE_ICONS = { hours: Clock, phone: Phone, address: MapPin, website: Globe } as const;

export const SHOP_LABEL = "About the shop";
