"use server";

import { getCurrentUser } from "@/lib/session";
import { reportSchema, type ReportInput } from "@/lib/validations/report.schema";
import { reportService } from "@/services/report/report.service";

import type { ActionResult } from "./action.type";

/** A signed-in customer reports a promotion or a sponsored banner. Business owners don't browse the public site. */
export async function reportAdAction(input: ReportInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in to report an ad." };
  if (user.role === "BUSINESS_OWNER") return { ok: false, error: "Business accounts can't report ads. Contact us instead." };

  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  return reportService.report(user.id, parsed.data);
}
