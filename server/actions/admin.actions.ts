"use server";

import { REPORT_DECISIONS } from "@/lib/constants";

import type { ActionResult } from "./action.type";
import { denyUnless } from "./guard";

const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "This isn't connected yet. Admin tools are coming soon.",
};
const MISSING: ActionResult = { ok: false, error: "Missing item." };

// Every action checks the caller is an admin first. When these are connected, anything that changes what the
// public sees (suspend, remove) must also write an audit log entry.
const needsId = async (id: string): Promise<ActionResult> => (await denyUnless("ADMIN")) ?? (id ? NOT_CONNECTED : MISSING);

export async function verifyBusinessAction(id: string): Promise<ActionResult> {
  return needsId(id);
}

export async function suspendBusinessAction(id: string): Promise<ActionResult> {
  return needsId(id);
}

export async function reinstateBusinessAction(id: string): Promise<ActionResult> {
  return needsId(id);
}

export async function resolveReportAction(input: {
  id: string;
  decision: string;
}): Promise<ActionResult> {
  const denied = await denyUnless("ADMIN");
  if (denied) return denied;
  if (!input.id) return MISSING;
  if (!(REPORT_DECISIONS as readonly string[]).includes(input.decision)) {
    return { ok: false, error: "Choose what to do with this report." };
  }
  return NOT_CONNECTED;
}
