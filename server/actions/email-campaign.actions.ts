"use server";

import {
  emailCampaignSchema,
  type EmailCampaignInput,
} from "@/lib/validations/email-campaign.schema";

import type { ActionResult } from "./action.type";

const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "Email sending isn't connected yet. We'll turn it on soon.",
};
const MISSING: ActionResult = { ok: false, error: "Missing campaign." };

// TODO: persist through the email campaign service and send through the email provider.
// Only people who opted in (email channel + "places I follow" + promotional messages) may be emailed.
export async function saveEmailCampaignAction(
  input: EmailCampaignInput,
): Promise<ActionResult> {
  return emailCampaignSchema.safeParse(input).success
    ? NOT_CONNECTED
    : { ok: false, error: "Please check the form and try again." };
}

export async function sendTestEmailAction(
  input: EmailCampaignInput,
): Promise<ActionResult> {
  return input.subject.trim() && input.body.trim()
    ? NOT_CONNECTED
    : { ok: false, error: "Add a subject and a message to send a test." };
}

export async function cancelEmailCampaignAction(
  id: string,
): Promise<ActionResult> {
  return id ? NOT_CONNECTED : MISSING;
}
