"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { resolveSchema, type ResolveInput } from "@/lib/validations/report.schema";
import { reportService } from "@/services/report/report.service";

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

/** An admin settles every open report about one ad: dismiss it, warn the business, or take the ad down. */
export async function resolveReportAction(input: ResolveInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const parsed = resolveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Choose what to do with this report." };

  const result = await reportService.resolve({ id: user.id, email: user.email }, parsed.data);
  if (result.ok) revalidatePath("/admin/moderation");
  return result;
}
