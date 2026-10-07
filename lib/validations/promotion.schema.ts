import { z } from "zod";

import { PLACEMENT_DAYS } from "@/lib/coins";
import { CTA_TYPES, PROMOTION_TYPES } from "@/lib/constants";

export const PUBLISHABLE = ["DRAFT", "PUBLISHED"] as const;

export const promotionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Enter a title")
      .max(80, "Keep it under 80 characters"),
    type: z.enum(PROMOTION_TYPES),
    discount: z.string().trim().max(40, "Keep it under 40 characters"),
    description: z.string().trim().max(1000, "Keep it under 1000 characters"),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string().trim().max(120, "Keep it under 120 characters"),
    category: z.string(),
    ctaType: z.enum(CTA_TYPES),
    ctaUrl: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v),
        "Enter a full link starting with https://",
      ),
    emailFollowers: z.boolean(),
    bannerDays: z.enum(PLACEMENT_DAYS),
    topRankDays: z.enum(PLACEMENT_DAYS),
    status: z.enum(PUBLISHABLE),
  })
  .superRefine((v, ctx) => {
    const add = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (v.startDate && v.endDate && v.endDate < v.startDate)
      add("endDate", "End date must be after the start date");
    if (v.status !== "PUBLISHED") {
      const needsPublish = "Publish the promotion to use coins on this";
      if (v.emailFollowers) add("emailFollowers", needsPublish);
      if (v.bannerDays !== "0") add("bannerDays", needsPublish);
      if (v.topRankDays !== "0") add("topRankDays", needsPublish);
      return;
    }

    if (v.description.length < 20)
      add("description", "Add at least 20 characters before publishing");
    if (!v.discount) add("discount", "Add the offer, e.g. 20% off");
    if (!v.category) add("category", "Pick a category before publishing");
    if (!v.startDate) add("startDate", "Add a start date before publishing");
    if (v.ctaType === "VISIT_WEBSITE" && !v.ctaUrl)
      add("ctaUrl", "Add the website link");
  });

export type PromotionInput = z.infer<typeof promotionSchema>;
