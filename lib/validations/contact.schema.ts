import { z } from "zod";

import { CONTACT_TOPICS } from "@/lib/contact";

const TOPIC_IDS = CONTACT_TOPICS.map((t) => t.id) as [string, ...string[]];

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Keep it under 80 characters"),
  email: z.string().trim().toLowerCase().min(1, "Enter your email").email("Enter a valid email").max(120, "That email is too long"),
  topic: z.enum(TOPIC_IDS, { message: "Choose what it's about" }),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)").max(2000, "Keep it under 2,000 characters"),
  /** A trap for bots: real people never see this box, so it stays empty. */
  hpCheck: z.string().max(200),
});

export type ContactInput = z.infer<typeof contactSchema>;
