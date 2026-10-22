"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { adminBannerSchema, bannerSchema, type AdminBannerInput, type BannerInput } from "@/lib/validations/banner.schema";
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

/** An admin makes a banner for a business. It is free, and only admins can do it. */
export async function createAdminBannerAction(input: AdminBannerInput): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  const parsed = adminBannerSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };

  const result = await bannerService.createByAdmin({ id: user.id, email: user.email }, parsed.data);
  if (!result.ok) return result;
  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

/** An admin takes a banner down. Only admins can, and it is checked here on every call. */
export async function takeDownBannerAction(id: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (user?.role !== "ADMIN") return { ok: false, error: "Only admins can do this." };
  if (typeof id !== "string" || !id) return { ok: false, error: "We couldn't find that banner." };

  const result = await bannerService.takeDown({ id: user.id, email: user.email }, id);
  if (result.ok) {
    revalidatePath("/admin/banners");
    revalidatePath("/");
    return { ok: true, message: "The banner was taken down." };
  }
  return result;
}
