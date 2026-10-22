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
