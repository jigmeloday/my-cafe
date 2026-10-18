"use server";

import {
  campaignSchema,
  type CampaignInput,
} from "@/lib/validations/campaign.schema";

import type { ActionResult } from "./action.type";
import { denyUnless } from "./guard";

const NOT_CONNECTED: ActionResult = {
  ok: false,
  error:
    "Campaigns aren't connected yet. Payments and billing are coming soon.",
};
const MISSING: ActionResult = { ok: false, error: "Missing campaign." };

// TODO: persist through the campaign service; spending must run inside one database transaction.
export async function saveCampaignAction(
  input: CampaignInput,
): Promise<ActionResult> {
  const denied = await denyUnless("BUSINESS_OWNER");
  if (denied) return denied;
  return campaignSchema.safeParse(input).success
    ? NOT_CONNECTED
    : { ok: false, error: "Please check the form and try again." };
}

export async function pauseCampaignAction(id: string): Promise<ActionResult> {
  const denied = await denyUnless("BUSINESS_OWNER");
  if (denied) return denied;
  return id ? NOT_CONNECTED : MISSING;
}

export async function resumeCampaignAction(id: string): Promise<ActionResult> {
  const denied = await denyUnless("BUSINESS_OWNER");
  if (denied) return denied;
  return id ? NOT_CONNECTED : MISSING;
}

export async function cancelCampaignAction(id: string): Promise<ActionResult> {
  const denied = await denyUnless("BUSINESS_OWNER");
  if (denied) return denied;
  return id ? NOT_CONNECTED : MISSING;
}
