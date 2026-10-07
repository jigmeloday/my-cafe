"use server";

import {
  promotionSchema,
  type PromotionInput,
} from "@/lib/validations/promotion.schema";

import type { ActionResult } from "./action.type";

const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "Saving isn't connected yet. Business accounts are coming soon.",
};

// TODO: persist through the promotion service once the database exists.
export async function savePromotionAction(
  input: PromotionInput,
): Promise<ActionResult> {
  return promotionSchema.safeParse(input).success
    ? NOT_CONNECTED
    : { ok: false, error: "Please check the form and try again." };
}

export async function endPromotionAction(id: string): Promise<ActionResult> {
  return id ? NOT_CONNECTED : { ok: false, error: "Missing promotion." };
}

export async function deletePromotionAction(id: string): Promise<ActionResult> {
  return id ? NOT_CONNECTED : { ok: false, error: "Missing promotion." };
}
