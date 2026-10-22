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

export type BannerInput = z.infer<typeof bannerSchema>;

/** The longest a banner can run in total, counting days added later. */
export const MAX_BANNER_DAYS = 30;

/** Changing a banner: its words and picture, and optionally more days at the end. Dates already running stay as they are. */
export const bannerEditSchema = bannerSchema.pick({ title: true, description: true, imageKey: true }).extend({
  /** Days added after the current end date. "0" adds none. Each costs `COIN_COSTS.bannerPerDay`. */
  extraDays: z.enum(["0", ...BANNER_DAYS]),
});

export type BannerEditInput = z.infer<typeof bannerEditSchema>;
