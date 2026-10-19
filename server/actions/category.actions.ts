"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/session";
import { categorySchema, type CategoryInput } from "@/lib/validations/category.schema";
import { categoryService } from "@/services/category/category.service";

import type { ActionResult } from "./action.type";

const idSchema = z.string().min(1).max(100);

/** Only admins change the category list, and that is checked here on every call. */
async function asAdmin(run: () => Promise<ActionResult>): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const result = await run();
  if (result.ok) {
    revalidatePath("/admin/categories");
    revalidatePath("/business/promotions", "layout");
  }
  return result;
}

const INVALID = { ok: false, error: "Please check the name and try again." } as const;

export async function createCategoryAction(input: CategoryInput): Promise<ActionResult> {
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? INVALID.error };
  return asAdmin(() => categoryService.create(parsed.data.name));
}

export async function renameCategoryAction(id: string, input: CategoryInput): Promise<ActionResult> {
  const parsedId = idSchema.safeParse(id);
  const parsed = categorySchema.safeParse(input);
  if (!parsedId.success || !parsed.success) return parsed.success ? INVALID : { ok: false, error: parsed.error.issues[0]?.message ?? INVALID.error };
  return asAdmin(() => categoryService.rename(parsedId.data, parsed.data.name));
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return INVALID;
  return asAdmin(() => categoryService.remove(parsed.data));
}
