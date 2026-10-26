"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { registrationSchema, type RegistrationInput } from "@/lib/validations/registration.schema";
import { registrationService } from "@/services/registration/registration.service";

import type { ActionResult } from "./action.type";

/** A signed-in customer reserves a seat at an event. */
export async function registerForEventAction(input: RegistrationInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in to reserve a seat." };
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await registrationService.register({ id: user.id, role: user.role, email: user.email }, parsed.data);
  if (result.ok) {
    revalidatePath("/events", "layout");
    revalidatePath("/promotions", "layout");
    revalidatePath("/profile/events");
    revalidatePath("/business/registrations", "layout");
  }
  return result;
}

/** A customer gives their seat back. */
export async function cancelRegistrationAction(promotionId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (typeof promotionId !== "string" || !promotionId) return { ok: false, error: "We couldn't find that event." };

  const result = await registrationService.cancel(user.id, promotionId);
  if (result.ok) {
    revalidatePath("/events", "layout");
    revalidatePath("/promotions", "layout");
    revalidatePath("/profile/events");
    revalidatePath("/business/registrations", "layout");
  }
  return result;
}
