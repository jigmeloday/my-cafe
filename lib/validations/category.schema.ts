import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Enter a name").max(30, "Keep it under 30 characters"),
});

export type CategoryInput = z.infer<typeof categorySchema>;
