"use server";

import {
  addressSchema,
  changePasswordSchema,
  contactSchema,
  personalInfoSchema,
  preferencesSchema,
  type AddressInput,
  type ChangePasswordInput,
  type ContactInput,
  type PersonalInfoInput,
  type PreferencesInput,
} from "@/lib/validations/profile.schema";

import type { ActionResult } from "./action.type";

const INVALID: ActionResult = {
  ok: false,
  error: "Please check the form and try again.",
};
const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "This isn't connected yet. Accounts are coming soon.",
};

// TODO: persist these once accounts and the database exist.
export async function updatePersonalInfoAction(
  input: PersonalInfoInput,
): Promise<ActionResult> {
  return personalInfoSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function updateContactAction(
  input: ContactInput,
): Promise<ActionResult> {
  return contactSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function updateAddressAction(
  input: AddressInput,
): Promise<ActionResult> {
  return addressSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function updatePreferencesAction(
  input: PreferencesInput,
): Promise<ActionResult> {
  return preferencesSchema.safeParse(input).success ? NOT_CONNECTED : INVALID;
}

export async function changePasswordAction(
  input: ChangePasswordInput,
): Promise<ActionResult> {
  return changePasswordSchema.safeParse(input).success
    ? NOT_CONNECTED
    : INVALID;
}

export async function deleteAccountAction(): Promise<ActionResult> {
  return NOT_CONNECTED;
}
