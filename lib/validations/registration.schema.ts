import { z } from "zod";

import { isValidPhone } from "@/lib/phone";

/** What a person gives to reserve a seat. Their name and phone go to the organiser, so they must agree to that. */
export const registrationSchema = z.object({
  promotionId: z.string().min(1).max(100),
  name: z.string().trim().min(2, "Enter your name").max(60, "Keep it under 60 characters"),
  /** Optional, but if given it must be a real Bhutan number. */
  phone: z.string().trim().refine(isValidPhone, "Enter a valid Bhutan phone number"),
  agree: z.boolean().refine((v) => v, "Please agree to share your name and phone with the organiser"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
