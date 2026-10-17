import type { Prisma } from "@/generated/prisma/client";
import { clampPage, totalPagesFor } from "@/lib/pagination";
import { escapeLike, parseSearch } from "@/lib/search";
import { adminUserRepository as repo, type AuditEntry } from "@/server/repositories/admin-user.repository";
import type { UserFilter, UserListQuery, UserListResult } from "@/types/admin-user";

export const USERS_PAGE_SIZE = 10;

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

/**
 * The database filter for a search and a group. Every word typed must match the name or the email (any
 * order, any letter case). When the search looks like a phone number, people whose saved phone contains
 * those digits match too.
 */
export function buildUserWhere({ q, filter }: Pick<UserListQuery, "q" | "filter">): Prisma.UserWhereInput {
  const { words, phoneDigits } = parseSearch(q);

  const everyWord: Prisma.UserWhereInput[] = words.map((word) => {
    const text = escapeLike(word);
    return { OR: [{ name: { contains: text, mode: "insensitive" } }, { email: { contains: text, mode: "insensitive" } }] };
  });

  const search: Prisma.UserWhereInput =
    words.length === 0
      ? {}
      : {
          OR: [
            { AND: everyWord },
            ...(phoneDigits ? [{ profile: { is: { phone: { contains: phoneDigits } } } }] : []),
          ],
        };

  const group: Prisma.UserWhereInput =
    filter === "SUSPENDED" ? { status: "SUSPENDED" } : filter !== "ALL" ? { role: filter } : {};

  return { AND: [group, search] };
}

export const adminUserService = {
  async list(query: UserListQuery, pageSize = USERS_PAGE_SIZE): Promise<UserListResult> {
    const where = buildUserWhere(query);
    const [total, roleCounts, suspended] = await Promise.all([
      repo.count(where),
      repo.countsByRole(),
      repo.countSuspended(),
    ]);

    const totalPages = totalPagesFor(total, pageSize);
    const page = clampPage(query.page, totalPages);
    const users = await repo.list(where, (page - 1) * pageSize, pageSize);

    const byRole = Object.fromEntries(roleCounts.map((r) => [r.role, r._count._all]));
    const counts: Record<UserFilter, number> = {
      ALL: roleCounts.reduce((sum, r) => sum + r._count._all, 0),
      USER: byRole.USER ?? 0,
      BUSINESS_OWNER: byRole.BUSINESS_OWNER ?? 0,
      ADMIN: byRole.ADMIN ?? 0,
      SUSPENDED: suspended,
    };

    return {
      items: users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        emailVerified: u.emailVerified,
        phone: u.profile?.phone ?? "",
        role: u.role,
        status: u.status,
        joined: isoDate(u.createdAt),
        lastActive: isoDate(u.sessions[0]?.updatedAt ?? u.createdAt),
      })),
      total,
      page,
      pageSize,
      totalPages,
      counts,
    };
  },

  suspend: (actor: Actor, targetId: string) => changeStatus(actor, targetId, "SUSPENDED"),
  unsuspend: (actor: Actor, targetId: string) => changeStatus(actor, targetId, "ACTIVE"),

  async remove(actor: Actor, targetId: string): Promise<Outcome> {
    const target = await checkTarget(actor, targetId);
    if ("error" in target) return { ok: false, error: target.error };
    if ((await repo.countBusinesses(target.user.id)) > 0) {
      return { ok: false, error: `${target.user.name} still owns a business. Remove or reassign it before deleting the account.` };
    }

    await repo.deleteUser(entry(actor, target.user, "user.delete"));
    return { ok: true, message: `${target.user.name} was deleted.` };
  },
};

export interface Actor {
  id: string;
  email: string;
}
type Outcome = { ok: true; message: string } | { ok: false; error: string };
type Target = NonNullable<Awaited<ReturnType<typeof repo.findById>>>;

const label = (user: Pick<Target, "name" | "email">) => `${user.name} <${user.email}>`;
const entry = (actor: Actor, user: Target, action: AuditEntry["action"]): AuditEntry => ({
  actorId: actor.id,
  actorEmail: actor.email,
  action,
  targetId: user.id,
  targetLabel: label(user),
});

/** The rules that apply to every action on a person: they exist, aren't you, and aren't an admin. */
async function checkTarget(actor: Actor, targetId: string): Promise<{ user: Target } | { error: string }> {
  const user = await repo.findById(targetId);
  if (!user) return { error: "That user no longer exists." };
  if (user.id === actor.id) return { error: "You can't do this to your own account." };
  if (user.role === "ADMIN") return { error: "Admins can't be suspended or deleted here." };
  return { user };
}

async function changeStatus(actor: Actor, targetId: string, status: "ACTIVE" | "SUSPENDED"): Promise<Outcome> {
  const target = await checkTarget(actor, targetId);
  if ("error" in target) return { ok: false, error: target.error };

  const { user } = target;
  const word = status === "SUSPENDED" ? "suspended" : "unsuspended";
  if (user.status === status) return { ok: true, message: `${user.name} is already ${word}.` };

  await repo.setStatus(entry(actor, user, status === "SUSPENDED" ? "user.suspend" : "user.unsuspend"), status);
  return { ok: true, message: `${user.name} was ${word}.` };
}
