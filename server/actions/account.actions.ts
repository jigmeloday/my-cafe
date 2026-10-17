"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ZodType } from "zod";

import { auth } from "@/lib/auth";
import { getCurrentUser } from "@/lib/session";
import {
  addressSchema,
  changePasswordSchema,
  contactSchema,
  interestsSchema,
  personalInfoSchema,
  preferencesSchema,
  type AddressInput,
  type ChangePasswordInput,
  type ContactInput,
  type InterestsInput,
  type PersonalInfoInput,
  type PreferencesInput,
} from "@/lib/validations/profile.schema";
import { profileService } from "@/services/profile/profile.service";

import type { ActionResult } from "./action.type";

const INVALID: ActionResult = { ok: false, error: "Please check the form and try again." };
const SIGNED_OUT: ActionResult = { ok: false, error: "Please log in again." };
const SAVED: ActionResult = { ok: true, message: "Saved." };

/** Runs a save for the signed-in person after re-validating the input on the server. */
async function save<T>(
  schema: ZodType<T>,
  input: unknown,
  run: (userId: string, data: T) => Promise<void>
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SIGNED_OUT;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return INVALID;

  await run(user.id, parsed.data);
  revalidatePath("/profile", "layout");
  return SAVED;
}

export async function updatePersonalInfoAction(input: PersonalInfoInput): Promise<ActionResult> {
  return save(personalInfoSchema, input, profileService.savePersonal);
}

export async function updateContactAction(input: ContactInput): Promise<ActionResult> {
  return save(contactSchema, input, profileService.saveContact);
}

export async function updateAddressAction(input: AddressInput): Promise<ActionResult> {
  return save(addressSchema, input, profileService.saveAddress);
}

export async function updatePreferencesAction(input: PreferencesInput): Promise<ActionResult> {
  return save(preferencesSchema, input, profileService.savePreferences);
}

export async function updateInterestsAction(input: InterestsInput): Promise<ActionResult> {
  return save(interestsSchema, input, (userId, { interests }) => profileService.saveInterests(userId, interests));
}

export async function changePasswordAction(input: ChangePasswordInput): Promise<ActionResult> {
  if (!(await getCurrentUser())) return SIGNED_OUT;
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) return INVALID;

  try {
    await auth.api.changePassword({
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.password,
        revokeOtherSessions: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    const message = error instanceof APIError && error.message ? error.message : "We couldn't change your password.";
    return { ok: false, error: message };
  }
  return { ok: true, message: "Password updated. You were signed out on other devices." };
}

export async function deleteAccountAction(): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return SIGNED_OUT;

  const result = await profileService.deleteAccount(user.id);
  if (!result.ok) return result;
  redirect("/");
}
