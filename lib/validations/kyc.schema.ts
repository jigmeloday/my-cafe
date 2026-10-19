import { z } from "zod";

import { KYC_PREFIX_REGEX } from "@/lib/kyc-regex";

export const kycSchema = z.object({
  ownerName: z.string().trim().min(3, "Enter your full name as on your ID").max(80, "Keep it under 80 characters"),
  /** Bhutanese citizenship ID numbers are 11 digits. */
  idNumber: z.string().trim().regex(/^\d{11}$/, "Enter your 11-digit ID number"),
  licenseNumber: z.string().trim().min(3, "Enter your licence number").max(40, "Keep it under 40 characters"),
  idDocKey: z.string().regex(KYC_PREFIX_REGEX, "Upload your ID document"),
  licenseDocKey: z.string().regex(KYC_PREFIX_REGEX, "Upload your trade licence"),
  premisesKey: z.string().refine((v) => v === "" || KYC_PREFIX_REGEX.test(v), "That photo isn't valid"),
  consent: z.literal(true, { message: "Please confirm to continue" }),
});

export type KycInput = z.infer<typeof kycSchema>;

export const kycReviewSchema = z.object({
  id: z.string().min(1).max(100),
  decision: z.enum(["APPROVED", "REJECTED"]),
  /** Required when rejecting: the owner is shown it so they can fix the problem. */
  note: z.string().trim().max(500, "Keep it under 500 characters"),
}).refine((v) => v.decision === "APPROVED" || v.note.length >= 10, { path: ["note"], message: "Tell the owner what to fix (at least 10 characters)" });

export type KycReviewInput = z.infer<typeof kycReviewSchema>;
