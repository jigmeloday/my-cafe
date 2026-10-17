"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/session";
import { adminUserService, type Actor } from "@/services/admin/admin-user.service";

import type { ActionResult } from "./action.type";

const idSchema = z.string().min(1).max(100);

/** Checks the caller is a signed-in admin, then runs the change and refreshes the list. */
async function asAdmin(
  id: unknown,
  run: (actor: Actor, id: string) => Promise<{ ok: true; message: string } | { ok: false; error: string }>
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please log in again." };
  // Never trust the page that showed the button: the role is checked here, on every action.
  if (user.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Missing user." };

  const result = await run({ id: user.id, email: user.email }, parsed.data);
  if (result.ok) revalidatePath("/admin/users");
  return result;
}

export async function suspendUserAction(id: string): Promise<ActionResult> {
  return asAdmin(id, adminUserService.suspend);
}

export async function unsuspendUserAction(id: string): Promise<ActionResult> {
  return asAdmin(id, adminUserService.unsuspend);
}

export async function deleteUserAction(id: string): Promise<ActionResult> {
  return asAdmin(id, adminUserService.remove);
}
