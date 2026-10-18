import { z } from "zod";

import { MAX_COIN_PURCHASE } from "@/lib/coins";

export const rechargeSchema = z.object({
  businessId: z.string().min(1).max(100),
  coins: z
    .number({ message: "Enter a number of coins." })
    .int("Enter a whole number of coins.")
    .min(1, "Add at least 1 coin.")
    .max(MAX_COIN_PURCHASE, `The most at a time is ${MAX_COIN_PURCHASE.toLocaleString("en")} coins.`),
  note: z.string().trim().max(100, "Keep the note under 100 characters"),
});

export type RechargeInput = z.infer<typeof rechargeSchema>;
