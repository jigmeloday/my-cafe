import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { Role } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";

export const HOME_BY_ROLE: Record<Role, string> = {
  ADMIN: "/admin/dashboard",
  BUSINESS_OWNER: "/business/dashboard",
  USER: "/profile",
};

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
  if (!allowed.includes(user.role)) redirect(HOME_BY_ROLE[user.role]);
  return user;
}
