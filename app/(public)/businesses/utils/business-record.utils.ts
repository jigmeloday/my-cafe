import type { Business } from "@/generated/prisma/client";
import { mediaUrl } from "@/lib/media";
import { readHours } from "@/services/business/business.service";

import { BUSINESS_COPY, CONTACT_ICONS } from "../constant/business.constant";
import type { BusinessContact, BusinessHours, BusinessProfile } from "../model/business.type";

/** "09:00" -> "9:00 am". */
export function formatTime(value: string) {
  const [h = 0, m = 0] = value.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

const toHours = (value: unknown): BusinessHours[] =>
  readHours(value).map(({ day, closed, open, close }) => ({
    day,
    hours: closed ? BUSINESS_COPY.closed : `${formatTime(open)} – ${formatTime(close)}`,
  }));

const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const socialLabel = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok" } as const;

function toContacts(b: Business): BusinessContact[] {
  const address = [b.addressLine1, b.addressLine2, b.town, b.dzongkhag, b.postalCode].filter(Boolean).join(", ");
  const lines: BusinessContact[] = [];
  if (b.phone) lines.push({ key: "phone", icon: CONTACT_ICONS.phone, text: b.phone, href: `tel:${b.phone.replace(/\s/g, "")}` });
  if (b.email) lines.push({ key: "email", icon: CONTACT_ICONS.email, text: b.email, href: `mailto:${b.email}` });
  // A pasted map link wins; otherwise a street address (a physical store) opens a maps search. Online-only shops stay plain text.
  if (address) lines.push({ key: "address", icon: CONTACT_ICONS.address, text: address, href: b.mapUrl || (b.addressLine1 ? mapsUrl(`${b.name}, ${address}`) : undefined) });
  if (b.website) lines.push({ key: "website", icon: CONTACT_ICONS.website, text: b.website.replace(/^https?:\/\//, ""), href: b.website });
  for (const key of ["facebook", "instagram", "tiktok"] as const) {
    if (b[key]) lines.push({ key, icon: CONTACT_ICONS.social, text: socialLabel[key], href: b[key] });
  }
  return lines;
}

/** Turns a saved business into what the public page shows. */
export function profileFromRecord(b: Business): BusinessProfile {
  return {
    slug: b.slug,
    name: b.name,
    tagline: b.tagline || undefined,
    category: "",
    area: [b.town, b.dzongkhag].filter(Boolean).join(", "),
    badge: b.status === "VERIFIED" ? "Verified" : undefined,
    openedLabel: "",
    openingOffer: "",
    about: b.description.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
    hours: toHours(b.hours),
    activity: [],
    similar: [],
    contacts: toContacts(b),
    services: b.services,
    products: b.products,
    showGallery: b.gallery.length > 0,
    seo: {
      phone: b.phone || undefined,
      website: b.website || undefined,
      street: [b.addressLine1, b.addressLine2].filter(Boolean).join(", ") || undefined,
      town: b.town || undefined,
      dzongkhag: b.dzongkhag || undefined,
      postalCode: b.postalCode || undefined,
      sameAs: [b.facebook, b.instagram, b.tiktok].filter(Boolean),
    },
    logoUrl: mediaUrl(b.logoKey) || undefined,
    coverUrl: mediaUrl(b.coverKey) || undefined,
    photos: b.gallery.map(mediaUrl),
  };
}
