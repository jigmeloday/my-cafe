import "server-only";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";

/** Browsers that aren't people: search engines, link previews, uptime checks and scripts. They are never counted. */
const BOT = /bot|crawl|spider|slurp|preview|headless|monitor|curl|wget|python|node-fetch|axios|facebookexternalhit/i;

/** The same fixed shift from UTC the rest of the app uses for a Bhutan day. */
const bhutanDay = (date: Date) => new Date(date.getTime() + 6 * 3_600_000).toISOString().slice(0, 10);

/**
 * A code that says "the same visitor, on the same day" without saying who. It is a signature of the address and
 * browser, made with our secret and today's date, so it can't be turned back into either, and tomorrow the same
 * person gets a different code. Nothing is stored in the browser, so no cookie (and no cookie banner) is needed.
 * Returns null for robots.
 */
export async function currentVisitor(now = new Date()): Promise<string | null> {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return null;

  const h = await headers();
  const agent = h.get("user-agent") ?? "";
  if (!agent || BOT.test(agent)) return null;

  const address = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  return createHmac("sha256", secret).update(`visitor:${bhutanDay(now)}:${address}:${agent}`).digest("base64url").slice(0, 22);
}
