import { headers } from "next/headers";

import { db } from "@/lib/db";

const MINUTE = 60_000;

/** How many tries are allowed in a window. Tuned so a real person never notices, but guessing passwords is hopeless. */
export const LIMITS = {
  loginPerEmail: { max: 5, windowMs: 15 * MINUTE },
  loginPerIp: { max: 30, windowMs: 15 * MINUTE },
  registerPerIp: { max: 10, windowMs: 60 * MINUTE },
  resendPerIp: { max: 10, windowMs: 60 * MINUTE },
  contactPerIp: { max: 5, windowMs: 60 * MINUTE },
  contactPerEmail: { max: 3, windowMs: 24 * 60 * MINUTE },
} as const;

type Limit = { max: number; windowMs: number };

export const TOO_MANY = "Too many attempts. Please wait a few minutes and try again.";

/** The caller's address, as the hosting platform reports it. */
export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export const rateLimit = {
  /** True when `key` has already used up its tries in the window. */
  async isBlocked(key: string, { max, windowMs }: Limit, now = new Date()) {
    const count = await db.rateLimitHit.count({ where: { key, createdAt: { gte: new Date(now.getTime() - windowMs) } } });
    return count >= max;
  },

  /** Counts one try. Old records are swept away as we go, so the table stays small. */
  async record(key: string, now = new Date()) {
    await db.rateLimitHit.create({ data: { key, createdAt: now } });
    await db.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(now.getTime() - 24 * 60 * MINUTE) } } });
  },

  /** Forgets a key's tries, e.g. after a successful login. */
  async clear(key: string) {
    await db.rateLimitHit.deleteMany({ where: { key } });
  },
};

export const loginKeys = (email: string, ip: string) => ({
  email: `login:email:${email.trim().toLowerCase()}`,
  ip: `login:ip:${ip}`,
});
