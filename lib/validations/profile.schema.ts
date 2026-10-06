import { z } from "zod";

import { CONTACT_METHODS, DZONGKHAGS, GENDERS } from "@/lib/constants";
import { isValidPhone } from "@/lib/phone";

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal("")]);

const phone = z
  .string()
  .trim()
  .refine(isValidPhone, "Enter a valid Bhutan phone number");

export const personalInfoSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  birthday: z
    .string()
    .refine(
      (v) => v === "" || !Number.isNaN(Date.parse(v)),
      "Enter a valid date",
    )
    .refine(
      (v) => v === "" || new Date(v) <= new Date(),
      "Birthday can't be in the future",
    ),
  gender: optionalEnum(GENDERS),
});

export const contactSchema = z
  .object({ phone, preferredContact: z.enum(CONTACT_METHODS) })
  .refine((v) => v.preferredContact === "email" || v.phone !== "", {
    path: ["phone"],
    message: "Add a phone number to use this contact method",
  });

export const addressSchema = z.object({
  line1: z.string().trim().max(120, "Keep it under 120 characters"),
  line2: z.string().trim().max(120, "Keep it under 120 characters"),
  town: z.string().trim().max(60, "Keep it under 60 characters"),
  dzongkhag: optionalEnum(DZONGKHAGS),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{0,6}$/, "Use digits only"),
});

export const preferencesSchema = z
  .object({
    channels: z.object({
      email: z.boolean(),
      sms: z.boolean(),
      push: z.boolean(),
    }),
    topics: z.object({
      followed: z.boolean(),
      weekend: z.boolean(),
      newPlaces: z.boolean(),
      ending: z.boolean(),
      birthday: z.boolean(),
    }),
    allowPersonalisation: z.boolean(),
    marketingConsent: z.boolean(),
  })
  .refine(
    (v) =>
      !Object.values(v.topics).some(Boolean) ||
      Object.values(v.channels).some(Boolean),
    {
      path: ["channels", "email"],
      message: "Turn on at least one channel to receive updates.",
    },
  );

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
  .refine((v) => v.password !== v.currentPassword, {
    path: ["password"],
    message: "Choose a password you haven't used here",
  });

export type PersonalInfoInput = z.infer<typeof personalInfoSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type PreferencesInput = z.infer<typeof preferencesSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
