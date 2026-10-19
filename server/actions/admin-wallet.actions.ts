"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { rechargeSchema, type RechargeInput } from "@/lib/validations/recharge.schema";
import { adminWalletService } from "@/services/admin/admin-wallet.service";

import type { ActionResult } from "./action.type";

/** Adds coins to a business wallet. Only admins can, and it is checked here on every call. */
export async function rechargeWalletAction(input: RechargeInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };

  const parsed = rechargeSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await adminWalletService.recharge({ id: user.id, email: user.email }, parsed.data);
  if (result.ok) {
    revalidatePath("/admin/wallets");
    revalidatePath("/business", "layout");
  }
  return result;
}
