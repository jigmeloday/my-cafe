import { sendEmail } from "@/services/email/email.service";
import { passwordChangedEmail, passwordResetEmail } from "@/services/email/templates";

/** How long a reset link works. Short, because anyone with the link can change the password. */
export const RESET_MINUTES = 60;
/** Where the link in the email lands (with ?token=... when it is valid, or ?error=INVALID_TOKEN). */
export const RESET_PATH = "/reset-password";

interface Person {
  email: string;
  name: string;
}

export const passwordResetService = {
  /** Emails the reset link. Never throws: if the email can't go out, it is logged and the person simply doesn't get one. */
  async sendLink(user: Person, url: string): Promise<void> {
    try {
      await sendEmail({ to: user.email, ...passwordResetEmail({ name: user.name, url, expiresInMinutes: RESET_MINUTES }) });
    } catch (error) {
      console.error("[email] Couldn't send the password reset email:", (error as Error).message);
    }
  },

  /** Tells the owner their password was changed, so they notice if it wasn't them. */
  async notifyChanged(user: Person): Promise<void> {
    try {
      await sendEmail({ to: user.email, ...passwordChangedEmail({ name: user.name, contactUrl: `${process.env.BETTER_AUTH_URL ?? ""}/contact` }) });
    } catch (error) {
      console.error("[email] Couldn't send the password-changed email:", (error as Error).message);
    }
  },
};
