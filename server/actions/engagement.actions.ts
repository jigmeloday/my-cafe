"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/session";
import { engagementService } from "@/services/engagement/engagement.service";

import type { ActionResult } from "./action.type";

const SIGNED_OUT: ActionResult = { ok: false, error: "Please log in first." };

const favoriteSchema = z.object({ href: z.string().max(120), saved: z.boolean() });
const followSchema = z.object({ href: z.string().max(120), following: z.boolean() });

async function run(
  parse: () => { success: boolean },
  change: (userId: string) => Promise<{ ok: true } | { ok: false; error: string }>
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SIGNED_OUT;
  if (!parse().success) return { ok: false, error: "That item can't be saved." };

  const result = await change(user.id);
  if (result.ok) revalidatePath("/profile", "layout");
  return result;
}

export async function setFavoriteAction(input: { href: string; saved: boolean }): Promise<ActionResult> {
  return run(() => favoriteSchema.safeParse(input), (id) => engagementService.setFavorite(id, input.href, input.saved));
}

export async function setFollowAction(input: { href: string; following: boolean }): Promise<ActionResult> {
  return run(() => followSchema.safeParse(input), (id) => engagementService.setFollow(id, input.href, input.following));
}
