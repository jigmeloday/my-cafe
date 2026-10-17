"use server";

import { revalidatePath } from "next/cache";
import type { ZodType } from "zod";

import { getCurrentUser } from "@/lib/session";
import {
  businessContactSchema,
  businessGeneralSchema,
  businessHoursSchema,
  businessOfferingsSchema,
  businessSocialSchema,
  type BusinessContactInput,
  type BusinessGeneralInput,
  type BusinessHoursInput,
  type BusinessOfferingsInput,
  type BusinessSocialInput,
} from "@/lib/validations/business.schema";
import { addressSchema, type AddressInput } from "@/lib/validations/profile.schema";
import { businessService, type Owner } from "@/services/business/business.service";

import type { ActionResult } from "./action.type";

const INVALID: ActionResult = { ok: false, error: "Please check the form and try again." };
const NOT_ALLOWED: ActionResult = { ok: false, error: "Please log in with a business account." };

/** Runs a save for the signed-in business owner after re-validating the input on the server. */
async function save<T>(
  schema: ZodType<T>,
  input: unknown,
  run: (owner: Owner, data: T) => Promise<{ ok: true } | { ok: false; error: string }>
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user || user.role !== "BUSINESS_OWNER") return NOT_ALLOWED;
  const parsed = schema.safeParse(input);
  if (!parsed.success) return INVALID;

  const result = await run(user, parsed.data);
  if (!result.ok) return result;
  revalidatePath("/business", "layout");
  return { ok: true, message: "Saved." };
}

export async function updateBusinessGeneralAction(input: BusinessGeneralInput): Promise<ActionResult> {
  return save(businessGeneralSchema, input, (id, d) => businessService.saveGeneral(id, d));
}

export async function updateBusinessContactAction(input: BusinessContactInput): Promise<ActionResult> {
  return save(businessContactSchema, input, (id, d) => businessService.saveContact(id, d));
}

export async function updateBusinessLocationAction(input: AddressInput): Promise<ActionResult> {
  return save(addressSchema, input, (id, d) => businessService.saveLocation(id, d));
}

export async function updateBusinessSocialAction(input: BusinessSocialInput): Promise<ActionResult> {
  return save(businessSocialSchema, input, (id, d) => businessService.saveSocial(id, d));
}

export async function updateBusinessHoursAction(input: BusinessHoursInput): Promise<ActionResult> {
  return save(businessHoursSchema, input, (id, d) => businessService.saveHours(id, d));
}

export async function updateBusinessOfferingsAction(input: BusinessOfferingsInput): Promise<ActionResult> {
  return save(businessOfferingsSchema, input, (id, d) => businessService.saveOfferings(id, d));
}
