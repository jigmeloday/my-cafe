import type { z } from "zod";

import { findBlockedWord } from "@/lib/content-filter";

/**
 * Add to a text field (`z.string().superRefine(noBlockedWords)`) to refuse wording that isn't allowed. Used on
 * everything a business publishes, so the form shows the problem next to the field and the server refuses it too.
 */
export function noBlockedWords(value: string, ctx: z.RefinementCtx) {
  const word = findBlockedWord(value);
  if (word) ctx.addIssue({ code: "custom", message: `Please remove “${word}”. Wording like this isn't allowed on Nook.` });
}
