"use server";

import { REPORT_DECISIONS } from "@/lib/constants";

import type { ActionResult } from "./action.type";

const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "This isn't connected yet. Admin tools are coming soon.",
};
const MISSING: ActionResult = { ok: false, error: "Missing item." };

// TODO: check the caller is an admin (role ADMIN) on every action, then write an audit log entry.
// Anything that changes what the public sees (suspend, remove) must be recorded.
const needsId = (id: string): ActionResult => (id ? NOT_CONNECTED : MISSING);

export async function verifyBusinessAction(id: string) {
  return needsId(id);
}

export async function suspendBusinessAction(id: string) {
  return needsId(id);
}

export async function reinstateBusinessAction(id: string) {
  return needsId(id);
}

export async function suspendUserAction(id: string) {
  return needsId(id);
}

export async function reinstateUserAction(id: string) {
  return needsId(id);
}

export async function resolveReportAction(input: {
  id: string;
  decision: string;
}): Promise<ActionResult> {
  if (!input.id) return MISSING;
  if (!(REPORT_DECISIONS as readonly string[]).includes(input.decision)) {
    return { ok: false, error: "Choose what to do with this report." };
  }
  return NOT_CONNECTED;
}
