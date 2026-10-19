"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/session";
import { resolveSchema, type ResolveInput } from "@/lib/validations/report.schema";
import { adminBusinessService } from "@/services/admin/admin-business.service";
import { reportService } from "@/services/report/report.service";

import type { ActionResult } from "./action.type";

const MISSING: ActionResult = { ok: false, error: "Missing item." };

/** Checks the caller is a signed-in admin, runs the change, and refreshes the lists that show it. Every admin action starts here. */
async function asAdmin(run: (actor: { id: string; email: string }) => Promise<ActionResult>): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const result = await run({ id: user.id, email: user.email });
  if (result.ok) {
    revalidatePath("/admin/businesses");
    revalidatePath("/admin/dashboard");
  }
  return result;
}

const idSchema = z.string().min(1).max(100);
const suspendSchema = z.object({
  id: idSchema,
  /** Shown to the owner, so it has to say something useful. */
  reason: z.string().trim().min(10, "Tell the owner why (at least 10 characters)").max(300, "Keep it under 300 characters"),
});

export async function verifyBusinessAction(id: string): Promise<ActionResult> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return MISSING;
  return asAdmin((actor) => adminBusinessService.verify(actor, parsed.data));
}

export async function suspendBusinessAction(input: { id: string; reason: string }): Promise<ActionResult> {
  const parsed = suspendSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check and try again." };
  return asAdmin((actor) => adminBusinessService.suspend(actor, parsed.data.id, parsed.data.reason));
}

export async function reinstateBusinessAction(id: string): Promise<ActionResult> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return MISSING;
  return asAdmin((actor) => adminBusinessService.reinstate(actor, parsed.data));
}

export async function resolveReportAction(input: ResolveInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const parsed = resolveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Choose what to do with this report." };

  const result = await reportService.resolve({ id: user.id, email: user.email }, parsed.data);
  if (result.ok) revalidatePath("/admin/moderation");
  return result;
}
