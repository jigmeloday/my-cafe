"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { promotionService } from "@/services/promotion/promotion.service";
import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/validations/promotion.schema";

import type { ActionResult } from "./action.type";

/** Creates a promotion, or updates one when `id` is given. On success the owner goes back to the list. */
export async function savePromotionAction(
  input: PromotionInput,
  id?: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  const parsed = promotionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };

  const result = await promotionService.save(user, parsed.data, id);
  if (!result.ok) return result;
  revalidatePath("/business/promotions");
  redirect("/business/promotions");
}

/** Runs a change on one of the signed-in owner's promotions. */
async function change(
  id: string,
  run: (ownerId: string, id: string) => Promise<{ ok: true } | { ok: false; error: string }>
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  if (!id) return { ok: false, error: "Missing promotion." };

  const result = await run(user.id, id);
  if (result.ok) revalidatePath("/business/promotions");
  return result.ok ? { ok: true, message: "Done." } : result;
}

export const endPromotionAction = async (id: string): Promise<ActionResult> => change(id, promotionService.end);

export const deletePromotionAction = async (id: string): Promise<ActionResult> => change(id, promotionService.remove);
