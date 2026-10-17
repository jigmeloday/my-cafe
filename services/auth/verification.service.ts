import { RESEND_COOLDOWN_SECONDS } from "@/lib/cooldown";
import { db } from "@/lib/db";
import { sendEmail } from "@/services/email/email.service";
import { accountExistsEmail, verificationEmail } from "@/services/email/templates";

/** How long a verification link works. */
export const VERIFICATION_MINUTES = 60;
/** Where the verification link sends people afterwards. */
export const VERIFIED_PATH = "/verified";

interface Person {
  id: string;
  email: string;
  name: string;
}

/**
 * Takes the "right to send" for this person: true for exactly one caller per cooldown, even when two
 * requests arrive at the same moment, because the check and the update are a single database statement.
 */
async function claimSend(userId: string): Promise<boolean> {
  const cutoff = new Date(Date.now() - RESEND_COOLDOWN_SECONDS * 1000);
  const { count } = await db.user.updateMany({
    where: { id: userId, OR: [{ verificationSentAt: null }, { verificationSentAt: { lt: cutoff } }] },
    data: { verificationSentAt: new Date() },
  });
  return count === 1;
}

const releaseSend = (userId: string) =>
  db.user.update({ where: { id: userId }, data: { verificationSentAt: null } }).catch(() => undefined);

export const verificationService = {
  /**
   * Emails the verification link, unless one went out in the last minute.
   * It never throws: if sending fails, the person can press "Resend" later, and the problem is logged.
   */
  async send(user: Person, url: string): Promise<void> {
    if (!(await claimSend(user.id))) return;
    try {
      await sendEmail({ to: user.email, ...verificationEmail({ name: user.name, url, expiresInMinutes: VERIFICATION_MINUTES }) });
    } catch (error) {
      await releaseSend(user.id);
      console.error("[email] Couldn't send the verification email:", (error as Error).message);
    }
  },

  /**
   * Someone tried to sign up with an address that already has an account. We don't say so on screen
   * (that would reveal who has an account); we email the real owner instead. Shares the same cooldown.
   */
  async notifyAccountExists(user: Person): Promise<void> {
    if (!(await claimSend(user.id))) return;
    try {
      const loginUrl = `${process.env.BETTER_AUTH_URL ?? ""}/login`;
      await sendEmail({ to: user.email, ...accountExistsEmail({ name: user.name, loginUrl }) });
    } catch (error) {
      await releaseSend(user.id);
      console.error("[email] Couldn't send the account-exists email:", (error as Error).message);
    }
  },
};
