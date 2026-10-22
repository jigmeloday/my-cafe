"use server";

import { LIMITS, TOO_MANY, clientIp, rateLimit } from "@/services/auth/rate-limit.service";
import { unsubscribeService } from "@/services/profile/unsubscribe.service";

import type { ActionResult } from "./action.type";

/** Opens to everyone, because the link in an email works without signing in. The signature in the link is the proof. */
export async function unsubscribeAction(token: string): Promise<ActionResult> {
  const ipKey = `unsubscribe:ip:${await clientIp()}`;
  if (await rateLimit.isBlocked(ipKey, LIMITS.unsubscribePerIp)) return { ok: false, error: TOO_MANY };
  await rateLimit.record(ipKey);

  return (await unsubscribeService.run(typeof token === "string" ? token : ""))
    ? { ok: true, message: "You're unsubscribed. We won't send you promotional emails." }
    : { ok: false, error: "This link isn't valid. Open the link from the email again, or change this in your profile settings." };
}
