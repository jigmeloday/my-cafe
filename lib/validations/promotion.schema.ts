import { z } from "zod";

import { CTA_TYPES, ORDERABLE_TYPES, ORDER_MODES, PROMOTION_TYPES, REGISTRATION_MODES } from "@/lib/constants";
import { daysOfRun, FEATURE_CHOICES } from "@/lib/featured";
import { parseMoney } from "@/lib/formatters/currency";
import { listingDays, MAX_LISTING_DAYS } from "@/lib/listing";
import { noBlockedWords } from "@/lib/validations/clean-text";

/** "" (no time) or a 24-hour time like "09:30". */
const CLOCK = /^$|^([01]\d|2[0-3]):[0-5]\d$/;

export const PUBLISHABLE = ["DRAFT", "PUBLISHED"] as const;

export const promotionSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Enter a title")
      .max(80, "Keep it under 80 characters")
      .superRefine(noBlockedWords),
    type: z.enum(PROMOTION_TYPES),
    discount: z.string().trim().max(40, "Keep it under 40 characters").superRefine(noBlockedWords),
    description: z.string().trim().max(1000, "Keep it under 1000 characters").superRefine(noBlockedWords),
    startDate: z.string(),
    endDate: z.string(),
    location: z.string().trim().max(120, "Keep it under 120 characters").superRefine(noBlockedWords),
    category: z.string(),
    ctaType: z.enum(CTA_TYPES),
    ctaUrl: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v),
        "Enter a full link starting with https://",
      ),
    photos: z.array(z.string().max(200)).max(5, "Add up to 5 photos"),
    /** How many days to feature it on the home page. "0" means not featured. */
    featureDays: z.enum(FEATURE_CHOICES),
    /** First featured day, "YYYY-MM-DD". Only used when `featureDays` isn't "0". */
    featureStart: z.string(),
    status: z.enum(PUBLISHABLE),
    /** Events only: the event's own days and times (the dates above are how long it is listed on Nook). */
    eventStartDate: z.string(),
    eventEndDate: z.string(),
    eventStartTime: z.string().regex(CLOCK, "Use a time like 10:00"),
    eventEndTime: z.string().regex(CLOCK, "Use a time like 16:00"),
    /** Events only: let people reserve a seat. */
    registrationMode: z.enum(REGISTRATION_MODES),
    /** When people reserve on another website: its address. */
    registrationUrl: z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v), "Enter a full link starting with https://"),
    /** The words on the reserve button. */
    registrationLabel: z.string().trim().max(30, "Keep it under 30 characters").superRefine(noBlockedWords),
    /** How many seats. Empty means no limit. */
    capacity: z.string().trim().regex(/^\d{0,5}$/, "Use digits only"),
    /** Deals and sales: the price in Nu., like "250" or "99.50". Empty when the owner would rather not say. */
    price: z.string().trim().refine((v) => v === "" || parseMoney(v) !== null, "Enter the price as a number, like 250"),
    /** Deals and sales: how people order. */
    orderMode: z.enum(ORDER_MODES),
    /** When people order on another website: its address. */
    orderUrl: z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v), "Enter a full link starting with https://"),
    /** The words on the order button. */
    orderLabel: z.string().trim().max(30, "Keep it under 30 characters").superRefine(noBlockedWords),
  })
  .superRefine((v, ctx) => {
    const add = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });

    if (v.type === "EVENT") {
      const lastDay = v.eventEndDate || v.eventStartDate;
      if (v.status === "PUBLISHED" && !v.eventStartDate) add("eventStartDate", "Add the day your event starts");
      if (v.eventEndDate && v.eventStartDate && v.eventEndDate < v.eventStartDate) add("eventEndDate", "The event can't end before it starts");
      if (v.eventEndDate && !v.eventStartDate) add("eventStartDate", "Add the day your event starts");
      if (v.eventStartTime && v.eventEndTime && lastDay === v.eventStartDate && v.eventEndTime <= v.eventStartTime) add("eventEndTime", "The end time must be after the start time");
      // Listing it after the event is over would be paying for nothing.
      if (lastDay && v.endDate && v.endDate > lastDay) add("endDate", "Your event is over by then. Show it until the event's last day at the latest.");
    }
    if (v.type === "EVENT" && v.registrationMode !== "NONE") {
      if (!v.registrationLabel) add("registrationLabel", "Add the words for the button");
      if (v.registrationMode === "NOOK" && v.capacity !== "" && Number(v.capacity) < 1) add("capacity", "Seats must be at least 1, or leave it empty for no limit");
      if (v.registrationMode === "EXTERNAL" && v.status === "PUBLISHED" && !v.registrationUrl) add("registrationUrl", "Add the link where people reserve");
    }
    if ((ORDERABLE_TYPES as readonly string[]).includes(v.type) && v.orderMode !== "NONE") {
      if (!v.orderLabel) add("orderLabel", "Add the words for the button");
      if (v.orderMode === "EXTERNAL" && v.status === "PUBLISHED" && !v.orderUrl) add("orderUrl", "Add the link where people order");
    }
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      add("endDate", "End date must be after the start date");
    if (v.featureDays !== "0") {
      if (v.status !== "PUBLISHED") add("featureDays", "Publish the promotion to feature it");
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(v.featureStart)) add("featureStart", "Choose the first day to feature it");
      else {
        const last = daysOfRun(v.featureStart, Number(v.featureDays)).at(-1)!;
        if (v.endDate && last > v.endDate) add("featureDays", "Your promotion ends before this feature would finish");
      }
    }
    if (v.status !== "PUBLISHED") return;

    if (v.description.length < 20)
      add("description", "Add at least 20 characters before publishing");
    if (!v.discount) add("discount", "Add the offer, e.g. 20% off");
    if (!v.category) add("category", "Pick a category before publishing");
    if (!v.startDate) add("startDate", "Add a start date before publishing");
    if (!v.endDate) add("endDate", "Add an end date before publishing");
    else if (v.startDate && listingDays(v.startDate, v.endDate, v.startDate) > MAX_LISTING_DAYS)
      add("endDate", `A promotion can run for up to ${MAX_LISTING_DAYS} days at a time`);
    if (v.ctaType === "VISIT_WEBSITE" && !v.ctaUrl)
      add("ctaUrl", "Add the website link");
  });

export type PromotionInput = z.infer<typeof promotionSchema>;
