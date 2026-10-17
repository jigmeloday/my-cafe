import { randomBytes } from "node:crypto";

import type {
  BusinessContactInput,
  BusinessGeneralInput,
  BusinessHoursInput,
  BusinessOfferingsInput,
  BusinessSocialInput,
} from "@/lib/validations/business.schema";
import type { AddressInput } from "@/lib/validations/profile.schema";
import { businessRepository } from "@/server/repositories/business.repository";
import type { BusinessProfileData } from "@/types/business-profile";

type Dzongkhag = AddressInput["dzongkhag"];
export interface Owner {
  id: string;
  name: string;
  email: string;
}
type Result = { ok: true } | { ok: false; error: string };

export const DEFAULT_HOURS: BusinessHoursInput["hours"] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
].map((day, i) => ({ day, closed: i === 6, open: i === 5 ? "10:00" : "09:00", close: i === 5 ? "20:00" : "18:00" }));

const slugBase = (name: string) =>
  name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "business";

/** A readable, unique address for the business page: "druk-cafe", then "druk-cafe-4f9a" if taken. */
async function uniqueSlug(name: string) {
  const base = slugBase(name);
  if (!(await businessRepository.slugTaken(base))) return base;
  return `${base}-${randomBytes(2).toString("hex")}`;
}

/** Hours are stored as JSON, so check the shape before trusting it. */
export function readHours(value: unknown): BusinessHoursInput["hours"] {
  if (!Array.isArray(value) || value.length !== 7) return DEFAULT_HOURS;
  return value.map((row, i) => ({
    day: DEFAULT_HOURS[i].day,
    closed: Boolean(row?.closed),
    open: String(row?.open ?? "09:00"),
    close: String(row?.close ?? "18:00"),
  }));
}

export const businessService = {
  /** The owner's profile, or a blank one (email prefilled) before they have saved anything. */
  async get(owner: Owner): Promise<{ exists: boolean; slug: string | null; data: BusinessProfileData }> {
    const { id: ownerId, email: accountEmail, name: accountName } = owner;
    const b = await businessRepository.findByOwner(ownerId);
    return {
      exists: !!b,
      slug: b?.slug ?? null,
      data: {
        general: { name: b?.name ?? accountName, tagline: b?.tagline ?? "", description: b?.description ?? "" },
        contact: { phone: b?.phone ?? "", email: b?.email || accountEmail, website: b?.website ?? "" },
        location: {
          line1: b?.addressLine1 ?? "",
          line2: b?.addressLine2 ?? "",
          town: b?.town ?? "",
          dzongkhag: (b?.dzongkhag ?? "") as Dzongkhag,
          postalCode: b?.postalCode ?? "",
        },
        social: { facebook: b?.facebook ?? "", instagram: b?.instagram ?? "", tiktok: b?.tiktok ?? "" },
        hours: { hours: readHours(b?.hours) },
        offerings: { services: b?.services ?? [], products: b?.products ?? [] },
      },
    };
  },

  /** A business for its public page. Suspended ones are hidden. */
  async findPublic(slug: string) {
    const business = await businessRepository.findBySlug(slug);
    return business && business.status !== "SUSPENDED" ? business : null;
  },

  /** The owner's business, created from their account name the first time anything is saved. */
  async ensure(owner: Owner) {
    const existing = await businessRepository.findByOwner(owner.id);
    if (existing) return existing;
    return businessRepository.create({ ownerId: owner.id, slug: await uniqueSlug(owner.name), name: owner.name, email: owner.email });
  },

  /** Creates the business the first time, then updates it. The page address is fixed once created. */
  async saveGeneral(owner: Owner, input: BusinessGeneralInput): Promise<Result> {
    return this.saveInto(owner, input);
  },

  async saveContact(owner: Owner, input: BusinessContactInput) {
    return this.saveInto(owner, input);
  },

  async saveLocation(owner: Owner, a: AddressInput) {
    return this.saveInto(owner, {
      addressLine1: a.line1,
      addressLine2: a.line2,
      town: a.town,
      dzongkhag: a.dzongkhag,
      postalCode: a.postalCode,
    });
  },

  async saveSocial(owner: Owner, input: BusinessSocialInput) {
    return this.saveInto(owner, input);
  },

  async saveHours(owner: Owner, { hours }: BusinessHoursInput) {
    return this.saveInto(owner, { hours });
  },

  async saveOfferings(owner: Owner, { services, products }: BusinessOfferingsInput) {
    return this.saveInto(owner, { services: [...new Set(services)], products: [...new Set(products)] });
  },

  async saveInto(owner: Owner, data: Parameters<typeof businessRepository.update>[2]): Promise<Result> {
    const business = await this.ensure(owner);
    await businessRepository.update(business.id, owner.id, data);
    return { ok: true };
  },
};
