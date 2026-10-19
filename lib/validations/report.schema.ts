import { z } from "zod";

import { REPORT_REASONS } from "@/lib/report-reasons";

const REASON_IDS = REPORT_REASONS.map((r) => r.id) as [string, ...string[]];

export const reportSchema = z
  .object({
    /** The promotion being reported... */
    promotionId: z.string().min(1).max(100).optional(),
    /** ...or the banner. Exactly one of the two. */
    bannerId: z.string().min(1).max(100).optional(),
    reason: z.enum(REASON_IDS, { message: "Choose a reason" }),
    details: z.string().trim().max(500, "Keep it under 500 characters"),
  })
  .refine((v) => !!v.promotionId !== !!v.bannerId, "Report one ad at a time");

export type ReportInput = z.infer<typeof reportSchema>;

export const resolveSchema = z.object({
  kind: z.enum(["promotion", "banner"]),
  targetId: z.string().min(1).max(100),
  decision: z.enum(["DISMISSED", "WARNED", "REMOVED"]),
});

export type ResolveInput = z.infer<typeof resolveSchema>;
