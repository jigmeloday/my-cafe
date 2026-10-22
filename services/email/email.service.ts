import type { EmailContent } from "./templates";

export interface EmailMessage extends EmailContent {
  to: string;
  /** Where a reply goes, if not the sender address. Must already be a checked email address. */
  replyTo?: string;
}

type Env = Record<string, string | undefined>;
type Fetch = (url: string, init: RequestInit) => Promise<Pick<Response, "ok" | "status" | "text">>;

const RESEND_URL = "https://api.resend.com/emails";
const DEFAULT_FROM = "Nook <onboarding@resend.dev>";

/** Which way emails go out: "resend" when a key is set, "console" while developing, or "missing" in production without one. */
export function emailMode(env: Env = process.env): "resend" | "console" | "missing" {
  if (env.RESEND_API_KEY?.trim()) return "resend";
  return env.NODE_ENV === "production" ? "missing" : "console";
}

/** Mail apps POST to this address themselves, so it points at the API route, not at the page people read. */
const oneClickUrl = (pageUrl: string) => {
  const url = new URL(pageUrl);
  url.pathname = "/api/unsubscribe";
  return url.toString();
};

/** Resend wants the body as JSON; this is that body. */
export const buildResendPayload = (message: EmailMessage, from: string) => ({
  from,
  to: [message.to],
  subject: message.subject,
  html: message.html,
  text: message.text,
  ...(message.replyTo ? { reply_to: message.replyTo } : {}),
  // Lets Gmail, Apple Mail and others show their own Unsubscribe button, which works in one press (RFC 8058).
  ...(message.unsubscribeUrl
    ? { headers: { "List-Unsubscribe": `<${oneClickUrl(message.unsubscribeUrl)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }
    : {}),
});

function printEmail(message: EmailMessage, reason: string) {
  console.info(`\n──── EMAIL (not sent: ${reason}) ────\nTo: ${message.to}\nSubject: ${message.subject}\n\n${message.text}\n─────────────────────────────────────────────\n`);
}

/**
 * Sends one email. In production it throws a plain-English error if it can't, so callers can decide what to do.
 * `fetchImpl` and `env` are only swapped out by tests.
 */
export async function sendEmail(
  message: EmailMessage,
  { env = process.env, fetchImpl = fetch as unknown as Fetch }: { env?: Env; fetchImpl?: Fetch } = {}
): Promise<void> {
  const mode = emailMode(env);

  if (mode === "missing") {
    throw new Error("Email isn't set up: add RESEND_API_KEY to the server's environment.");
  }

  if (mode === "console") {
    // Development only: no provider is configured, so show the email here instead of sending it.
    printEmail(message, "no RESEND_API_KEY");
    return;
  }

  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(buildResendPayload(message, env.EMAIL_FROM?.trim() || DEFAULT_FROM)),
  });

  if (!response.ok) {
    // Resend explains what is wrong, e.g. an unverified sending domain. Show it, but never the key.
    const detail = await response.text().catch(() => "");
    const problem = `Resend rejected the email (${response.status}): ${detail.slice(0, 300)}`;
    if (env.NODE_ENV === "production") throw new Error(problem);

    // While developing, a refusal (most often the free sandbox sender only allowing your own address)
    // shouldn't block you: say what happened and show the email so its link can still be used.
    console.warn(`[email] ${problem}`);
    printEmail(message, "Resend refused it; shown here so you can keep testing");
  }
}
