import { LEGAL } from "@/lib/legal";
import { TOPIC_LABEL } from "@/lib/contact";
import type { ContactInput } from "@/lib/validations/contact.schema";
import { contactRepository } from "@/server/repositories/contact.repository";
import { LIMITS, rateLimit, TOO_MANY } from "@/services/auth/rate-limit.service";
import { sendEmail } from "@/services/email/email.service";
import { contactNotificationEmail } from "@/services/email/templates";

type Result = { ok: true; message: string } | { ok: false; error: string };

export interface InboxMessage {
  id: string;
  name: string;
  email: string;
  topic: string;
  topicLabel: string;
  message: string;
  /** "YYYY-MM-DDTHH:mm" in Bhutan time. */
  sentAt: string;
  status: "OPEN" | "DONE";
  signedIn: boolean;
}

const toBhutan = (d: Date) => new Date(d.getTime() + 6 * 3_600_000).toISOString().slice(0, 16);
const THANKS = "Thank you. We've got your message and will reply to your email address soon.";
const hasInbox = !LEGAL.contactEmail.startsWith("[");

export const contactService = {
  /**
   * Saves a message from the Contact page and tells the team. Open to everyone, so it defends itself: a hidden box
   * that only bots fill in (they are told "thanks" and nothing is saved), and limits per address and per email.
   */
  async send(input: ContactInput, context: { ip: string; userId: string | null }, now = new Date()): Promise<Result> {
    // A bot filled in the trap box. Say thanks so it learns nothing, and do nothing.
    if (input.hpCheck.trim() !== "") return { ok: true, message: THANKS };

    const ipKey = `contact:ip:${context.ip}`;
    const emailKey = `contact:email:${input.email}`;
    if ((await rateLimit.isBlocked(ipKey, LIMITS.contactPerIp, now)) || (await rateLimit.isBlocked(emailKey, LIMITS.contactPerEmail, now))) {
      return { ok: false, error: TOO_MANY };
    }
    await Promise.all([rateLimit.record(ipKey, now), rateLimit.record(emailKey, now)]);

    await contactRepository.create({ name: input.name, email: input.email, topic: input.topic, message: input.message, userId: context.userId });

    // The message is saved, so a mail hiccup must not make the sender think it failed.
    if (hasInbox) {
      try {
        await sendEmail({ to: LEGAL.contactEmail, replyTo: input.email, ...contactNotificationEmail({ name: input.name, email: input.email, topic: TOPIC_LABEL[input.topic] ?? input.topic, message: input.message }) });
      } catch (error) {
        console.error("[contact] couldn't email the team about a new message", error);
      }
    }
    return { ok: true, message: THANKS };
  },

  async inbox(status: "OPEN" | "DONE" | "ALL"): Promise<InboxMessage[]> {
    const rows = await contactRepository.list(status);
    return rows.map((m) => ({
      id: m.id,
      name: m.name,
      email: m.email,
      topic: m.topic,
      topicLabel: TOPIC_LABEL[m.topic] ?? m.topic,
      message: m.message,
      sentAt: toBhutan(m.createdAt),
      status: m.status,
      signedIn: m.userId !== null,
    }));
  },

  openCount: () => contactRepository.countOpen(),

  async markDone(adminId: string, id: string, now = new Date()): Promise<Result> {
    return (await contactRepository.markDone(id, adminId, now)) ? { ok: true, message: "Marked as done." } : { ok: false, error: "That message was already dealt with." };
  },
};
