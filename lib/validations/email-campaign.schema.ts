import { z } from "zod";

import { SEND_MODES } from "@/lib/constants";

export const emailCampaignSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Enter a campaign name")
      .max(60, "Keep it under 60 characters"),
    subject: z.string().trim().max(80, "Keep the subject under 80 characters"),
    previewText: z.string().trim().max(120, "Keep it under 120 characters"),
    body: z.string().trim().max(2000, "Keep the message under 2000 characters"),
    promotionId: z.string(),
    locations: z.array(z.string()),
    interests: z.array(z.string()),
    birthdayThisMonth: z.boolean(),
    sendMode: z.enum(SEND_MODES),
    sendDate: z.string(),
    sendTime: z.string(),
    intent: z.enum(["DRAFT", "SEND"]),
  })
  .superRefine((v, ctx) => {
    const add = (path: keyof typeof v, message: string) =>
      ctx.addIssue({ code: "custom", path: [path], message });
    if (v.intent !== "SEND") return;

    if (v.subject.length < 3) add("subject", "Add a subject before sending");
    if (v.body.length < 20)
      add("body", "Write at least 20 characters before sending");
    if (v.sendMode !== "LATER") return;

    if (!v.sendDate) return add("sendDate", "Pick a date to schedule");
    if (!v.sendTime) return add("sendTime", "Pick a time to schedule");
    if (new Date(`${v.sendDate}T${v.sendTime}`) <= new Date())
      add("sendDate", "Choose a time in the future");
  });

export type EmailCampaignInput = z.infer<typeof emailCampaignSchema>;
