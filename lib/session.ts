import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import type { Role } from "@/generated/prisma/enums";
import { HOME_BY_ROLE, decide, type Area } from "@/lib/access";
import { auth } from "@/lib/auth";

export { HOME_BY_ROLE };

/** The signed-in user, or null. Suspended accounts count as signed out. */
export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  // Suspended or not-yet-verified accounts count as signed out, even if an older session cookie is still around.
  if (!user || !user.emailVerified || (user as { status?: string }).status === "SUSPENDED") return null;
  return { ...user, role: (user as { role?: Role }).role ?? "USER" } as typeof user & { role: Role };
}

/** For layouts and pages: sends visitors to log in, and other roles to their own home. */
export async function requireRole(...allowed: Role[]) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!allowed.includes(user.role)) {
    // The admin area doesn't admit it exists to anyone else.
    if (allowed.length === 1 && allowed[0] === "ADMIN") notFound();
    redirect(HOME_BY_ROLE[user.role]);
  }
  return user;
}

/**
 * For layouts and pages: applies the access table for an area (see lib/access.ts). Returns the signed-in user,
 * or null when the area is open to signed-out visitors. Redirects or 404s everyone else.
 */
export async function guardArea(area: Area) {
  const user = await getCurrentUser();
  const decision = decide(user?.role ?? null, area);
  if (decision.action === "login") redirect("/login");
  if (decision.action === "redirect") redirect(decision.to);
  if (decision.action === "notFound") notFound();
  return user;
}
