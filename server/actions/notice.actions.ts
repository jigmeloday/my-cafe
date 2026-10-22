"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { reportService } from "@/services/report/report.service";

import type { ActionResult } from "./action.type";

/** A business owner closes one of the messages from Nook on their dashboard. It stays closed. */
export async function dismissNoticeAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  if (typeof id !== "string" || !id) return { ok: false, error: "We couldn't find that message." };

  const result = await reportService.dismissNotice(user.id, id);
  revalidatePath("/business/dashboard");
  return result;
}
