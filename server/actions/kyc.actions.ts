"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { kycReviewSchema, kycSchema, type KycInput, type KycReviewInput } from "@/lib/validations/kyc.schema";
import { kycService } from "@/services/kyc/kyc.service";

import type { ActionResult } from "./action.type";

/** A business owner sends their documents for review. */
export async function submitKycAction(input: KycInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  const parsed = kycSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await kycService.submit(user, parsed.data);
  if (result.ok) revalidatePath("/business/verification");
  return result;
}

/** An admin approves or rejects a request. Admin only, checked here on every call. */
export async function reviewKycAction(input: KycReviewInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const parsed = kycReviewSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await kycService.review({ id: user.id, email: user.email }, parsed.data);
  if (result.ok) {
    revalidatePath("/admin/verification");
    revalidatePath("/admin/dashboard");
  }
  return result;
}
