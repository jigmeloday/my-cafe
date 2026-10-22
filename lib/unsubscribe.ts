import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Unsubscribe links. The link carries the person's id and a signature only we can make (HMAC with the server
 * secret), so nobody can unsubscribe someone else by guessing or editing it, and it shows nothing else about them.
 * It never expires on purpose: an old email must still let you stop the messages.
 */
const secret = () => {
  const value = process.env.BETTER_AUTH_SECRET;
  if (!value) throw new Error("BETTER_AUTH_SECRET isn't set.");
  return value;
};

const sign = (userId: string) => createHmac("sha256", secret()).update(`unsubscribe:${userId}`).digest("base64url");

export const unsubscribeToken = (userId: string) => `${Buffer.from(userId).toString("base64url")}.${sign(userId)}`;

/** The person this token belongs to, or null when it was changed or isn't ours. */
export function userIdFromToken(token: string): string | null {
  const [encoded, signature, ...rest] = token.split(".");
  if (!encoded || !signature || rest.length > 0 || token.length > 300) return null;

  const userId = Buffer.from(encoded, "base64url").toString();
  const expected = Buffer.from(sign(userId));
  const given = Buffer.from(signature);
  // Compared in constant time, so response speed can't be used to work out a valid signature.
  return given.length === expected.length && timingSafeEqual(given, expected) ? userId : null;
}

/** The link to put in a promotional email. */
export const unsubscribeUrl = (userId: string) =>
  `${process.env.BETTER_AUTH_URL ?? ""}/unsubscribe?token=${unsubscribeToken(userId)}`;
