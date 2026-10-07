import { z } from "zod";

import {
  CAMPAIGN_DESTINATIONS,
  CAMPAIGN_SCHEDULES,
  MIN_CPC_MINOR,
} from "@/lib/constants";
import {
  formatMoney,
  MONEY_PATTERN,
  parseMoney,
} from "@/lib/formatters/currency";

const MONEY_MESSAGE = "Enter an amount like 0.50";
const money = z.string().trim().regex(MONEY_PATTERN, MONEY_MESSAGE);
const optionalMoney = z
  .string()
  .trim()
  .refine((v) => v === "" || MONEY_PATTERN.test(v), MONEY_MESSAGE);

export const campaignSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Enter a campaign name")
      .max(60, "Keep it under 60 characters"),
    promotionId: z.string(),
    cpc: money,
    dailyBudget: optionalMoney,
    totalBudget: money,
    startDate: z.string(),
    endDate: z.string(),
    destination: z.enum(CAMPAIGN_DESTINATIONS),
    destinationUrl: z
      .string()
      .trim()
      .refine(
        (v) => v === "" || /^https?:\/\/\S+\.\S+$/.test(v),
        "Enter a full link starting with https://",
      ),
    locations: z.array(z.string()),
    interests: z.array(z.string()),
    schedule: z.enum(CAMPAIGN_SCHEDULES),
    intent: z.enum(["DRAFT", "LAUNCH"]),
  })
  .superRefine((v, ctx) => {
    const add = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });
    const cpc = parseMoney(v.cpc);
    const total = parseMoney(v.totalBudget);
    const daily = v.dailyBudget ? parseMoney(v.dailyBudget) : null;

    if (cpc !== null && cpc < MIN_CPC_MINOR)
      add("cpc", `Minimum cost per click is ${formatMoney(MIN_CPC_MINOR)}`);
    if (cpc !== null && total !== null && total < cpc)
      add("totalBudget", "Budget must cover at least one click");
    if (daily !== null && cpc !== null && daily < cpc)
      add("dailyBudget", "Daily budget must cover at least one click");
    if (daily !== null && total !== null && daily > total)
      add("dailyBudget", "Daily budget can't be more than the total");
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      add("endDate", "End date must be after the start date");

    if (v.intent !== "LAUNCH") return;
    if (!v.promotionId) add("promotionId", "Choose a promotion to boost");
    if (!v.startDate) add("startDate", "Add a start date to launch");
    if (v.destination === "CUSTOM" && !v.destinationUrl)
      add("destinationUrl", "Add the link people should land on");
  });

export type CampaignInput = z.infer<typeof campaignSchema>;
