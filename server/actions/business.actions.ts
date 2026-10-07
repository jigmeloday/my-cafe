"use server";

import type { ZodType } from "zod";

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
import {
  addressSchema,
  type AddressInput,
} from "@/lib/validations/profile.schema";

import type { ActionResult } from "./action.type";

const INVALID: ActionResult = {
  ok: false,
  error: "Please check the form and try again.",
};
const NOT_CONNECTED: ActionResult = {
  ok: false,
  error: "Saving isn't connected yet. Business accounts are coming soon.",
};

// TODO: persist through the business service once the database exists.
const check = (schema: ZodType, input: unknown): ActionResult =>
  schema.safeParse(input).success ? NOT_CONNECTED : INVALID;

export async function updateBusinessGeneralAction(input: BusinessGeneralInput) {
  return check(businessGeneralSchema, input);
}

export async function updateBusinessContactAction(input: BusinessContactInput) {
  return check(businessContactSchema, input);
}

export async function updateBusinessLocationAction(input: AddressInput) {
  return check(addressSchema, input);
}

export async function updateBusinessSocialAction(input: BusinessSocialInput) {
  return check(businessSocialSchema, input);
}

export async function updateBusinessHoursAction(input: BusinessHoursInput) {
  return check(businessHoursSchema, input);
}

export async function updateBusinessOfferingsAction(
  input: BusinessOfferingsInput,
) {
  return check(businessOfferingsSchema, input);
}
