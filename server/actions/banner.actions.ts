"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { bannerEditSchema, bannerSchema, type BannerEditInput, type BannerInput } from "@/lib/validations/banner.schema";
import { bannerService } from "@/services/banner/banner.service";

import type { ActionResult } from "./action.type";

/** Creates a banner and pays for it. On success the owner goes back to their banner list. */
export async function createBannerAction(input: BannerInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await bannerService.create(user, parsed.data);
  if (!result.ok) return result;
  revalidatePath("/business/banners");
  revalidatePath("/business", "layout");
  redirect("/business/banners");
}

/** Changes a banner's words and picture, and optionally adds paid days. On success the owner goes back to the list. */
export async function updateBannerAction(id: string, input: BannerEditInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  const parsed = bannerEditSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await bannerService.update(user, id, parsed.data);
  if (!result.ok) return result;
  revalidatePath("/business/banners");
  revalidatePath("/business", "layout");
  redirect("/business/banners");
}

/** Deletes one of the owner's banners. The days already paid for are not refunded. */
export async function deleteBannerAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return { ok: false, error: "Please log in with a business account." };
  if (!id) return { ok: false, error: "Missing banner." };

  const result = await bannerService.remove(user, id);
  if (result.ok) {
    revalidatePath("/business/banners");
    revalidatePath("/business", "layout");
  }
  return result;
}
