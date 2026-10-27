import { z } from "zod";

import { MAX_ORDER_QUANTITY } from "@/lib/constants";
import { isValidPhone } from "@/lib/phone";
import { noBlockedWords } from "@/lib/validations/clean-text";

/** What a customer gives to order an item. Their name, phone and note go to the seller, so they must agree to that. */
export const orderSchema = z.object({
  promotionId: z.string().min(1).max(100),
  name: z.string().trim().min(2, "Enter your name").max(60, "Keep it under 60 characters"),
  /** The seller needs a way to reach them, so unlike a reservation the phone is required. */
  phone: z.string().trim().min(1, "Enter a phone number so the seller can reach you").refine(isValidPhone, "Enter a valid Bhutan phone number"),
  quantity: z.number({ message: "Enter how many you want" }).int("Enter a whole number").min(1, "Order at least 1").max(MAX_ORDER_QUANTITY, `You can order up to ${MAX_ORDER_QUANTITY} at once`),
  note: z.string().trim().max(200, "Keep it under 200 characters").superRefine(noBlockedWords),
  agree: z.boolean().refine((v) => v, "Please agree to share your name, phone and note with the seller"),
});

export type OrderInput = z.infer<typeof orderSchema>;
