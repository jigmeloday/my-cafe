import { z } from "zod";

import { isValidPhone } from "@/lib/phone";

const link = z
  .string()
  .trim()
  .refine(
    (v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v),
    "Enter a full link starting with https://",
  );

const listItem = z
  .string()
  .trim()
  .min(1)
  .max(40, "Keep each item under 40 characters");

export const businessGeneralSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your business name")
    .max(60, "Keep it under 60 characters"),
  tagline: z.string().trim().max(80, "Keep it under 80 characters"),
  description: z.string().trim().max(500, "Keep it under 500 characters"),
  categories: z
    .array(z.string())
    .min(1, "Pick at least one category")
    .max(3, "Pick up to 3 categories"),
});

export const businessContactSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Add a phone number")
    .refine(isValidPhone, "Enter a valid Bhutan phone number"),
  email: z.string().trim().min(1, "Add an email").email("Enter a valid email"),
  website: link,
});

export const businessSocialSchema = z.object({
  facebook: link,
  instagram: link,
  tiktok: link,
});

export const businessHoursSchema = z
  .object({
    hours: z
      .array(
        z.object({
          day: z.string(),
          closed: z.boolean(),
          open: z.string(),
          close: z.string(),
        }),
      )
      .length(7),
  })
  .superRefine((value, ctx) => {
    value.hours.forEach((row, index) => {
      if (!row.closed && (!row.open || !row.close || row.open >= row.close)) {
        ctx.addIssue({
          code: "custom",
          path: ["hours", index, "close"],
          message: "Closing time must be after opening time",
        });
      }
    });
  });

export const businessOfferingsSchema = z.object({
  services: z.array(listItem).max(20, "Add up to 20 services"),
  products: z.array(listItem).max(20, "Add up to 20 products"),
});

export type BusinessGeneralInput = z.infer<typeof businessGeneralSchema>;
export type BusinessContactInput = z.infer<typeof businessContactSchema>;
export type BusinessSocialInput = z.infer<typeof businessSocialSchema>;
export type BusinessHoursInput = z.infer<typeof businessHoursSchema>;
export type BusinessOfferingsInput = z.infer<typeof businessOfferingsSchema>;
