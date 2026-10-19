import type { Role } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/session";

import type { ActionResult } from "./action.type";

/**
 * Put at the top of every action that isn't open to everyone. Returns a "no" to hand back to the caller, or
 * null when the signed-in person has one of the allowed roles. Never trust that a button was only shown to the
 * right people: anyone can call a server action directly.
 */
export async function denyUnless(...allowed: Role[]): Promise<ActionResult | null> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  if (!allowed.includes(user.role)) return { ok: false, error: "You don't have permission to do this." };
  return null;
}
