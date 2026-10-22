import { z } from "zod";

/** How many days a banner can run. Each day costs `COIN_COSTS.bannerPerDay` coins. */
export const BANNER_DAYS = ["3", "7", "14"] as const;

export const bannerSchema = z.object({
  title: z.string().trim().min(3, "Enter a headline").max(60, "Keep it under 60 characters"),
  description: z.string().trim().max(100, "Keep it under 100 characters"),
  /** The uploaded image's file key. */
  imageKey: z.string().min(1, "Add a banner image").max(200),
  /** First day it shows, "YYYY-MM-DD". */
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a start date"),
  days: z.enum(BANNER_DAYS),
});

/** An admin can run a banner for any business, for longer than an owner can buy, and it costs nothing. */
export const ADMIN_BANNER_DAYS = ["3", "7", "14", "30"] as const;

export const adminBannerSchema = bannerSchema.extend({
  /** A business id, or `ANNOUNCEMENT` for a banner that belongs to the whole site. */
  businessId: z.string().min(1, "Choose who the banner is for").max(100),
  /** Where it leads: a full link, a page on this site like "/deals", or empty for nowhere. */
  linkUrl: z
    .string()
    .trim()
    .max(300)
    .refine((v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v) || /^\/(?!\/)[\w\-/?=&%.#]*$/.test(v), "Enter a full link starting with https://, or a page like /deals"),
  days: z.enum(ADMIN_BANNER_DAYS),
});

export type AdminBannerInput = z.infer<typeof adminBannerSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
