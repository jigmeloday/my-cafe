import { z } from "zod";

export const INSERT_CAFE_SCHEMA = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  subTitle: z.string().nullable().optional(),
  logo: z.string().url("Logo must be a valid URL").nullable().optional(),
  openTime: z.string().min(1, "Open time is required"),
  closeTime: z.string().min(1, "Close time is required"),
  themeColor: z
    .string()
    .regex(/^#([0-9A-F]{3}){1,2}$/i, "Theme color must be a valid hex code"),
  closed: z.boolean().default(false).optional(),
});
