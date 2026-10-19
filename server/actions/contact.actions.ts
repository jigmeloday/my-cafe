"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/session";
import { contactSchema, type ContactInput } from "@/lib/validations/contact.schema";
import { clientIp } from "@/services/auth/rate-limit.service";
import { contactService } from "@/services/contact/contact.service";

import type { ActionResult } from "./action.type";

/** Sends a message from the Contact page. Open to everyone: signed in or not. */
export async function sendContactAction(input: ContactInput): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const user = await getCurrentUser();
  return contactService.send(parsed.data, { ip: await clientIp(), userId: user?.id ?? null });
}

/** An admin marks a message as dealt with. Admin only, checked here on every call. */
export async function markMessageDoneAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  if (!id || id.length > 100) return { ok: false, error: "Missing message." };

  const result = await contactService.markDone(user.id, id);
  if (result.ok) {
    revalidatePath("/admin/messages");
    revalidatePath("/admin/dashboard");
  }
  return result;
}
