import { businessVerifiedEmail, coinsAddedEmail } from "@/services/email/business-templates";
import { sendEmail } from "@/services/email/email.service";

interface Owner {
  email: string;
  name: string;
}

/** Runs an email send that must never get in the way of what the admin just did: a failure is only logged. */
async function quietly(what: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`[email] Couldn't send the ${what} email:`, (error as Error).message);
  }
}

/**
 * Emails owners about what happened to their business. These are account messages, not promotions, so they go to
 * everyone regardless of the promotional-email setting (and carry no unsubscribe link).
 */
export const businessNotifyService = {
  verified: (owner: Owner, businessName: string) =>
    quietly("business verified", () => sendEmail({ to: owner.email, ...businessVerifiedEmail({ name: owner.name, businessName }) })),

  coinsAdded: (owner: Owner, input: { businessName: string; coins: number; balance: number; note?: string }) =>
    quietly("coins added", () => sendEmail({ to: owner.email, ...coinsAddedEmail({ name: owner.name, ...input }) })),
};
