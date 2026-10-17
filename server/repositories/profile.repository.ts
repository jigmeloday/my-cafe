import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Database access for profiles. No rules live here: see services/profile. */
export const profileRepository = {
  findByUserId: (userId: string) =>
    db.user.findUnique({ where: { id: userId }, include: { profile: true } }),

  /** Saves profile fields, creating the profile row the first time. */
  upsert: (userId: string, data: Prisma.ProfileUncheckedUpdateInput) =>
    db.profile.upsert({
      where: { userId },
      create: { ...(data as Prisma.ProfileUncheckedCreateInput), userId },
      update: data,
    }),

  /** The name lives on the user, the birthday and gender on the profile: both change together. */
  savePersonal: (userId: string, name: string, data: Prisma.ProfileUncheckedUpdateInput) =>
    db.$transaction([
      db.user.update({ where: { id: userId }, data: { name } }),
      db.profile.upsert({
        where: { userId },
        create: { ...(data as Prisma.ProfileUncheckedCreateInput), userId },
        update: data,
      }),
    ]),

  countBusinesses: (userId: string) => db.business.count({ where: { ownerId: userId } }),

  deleteUser: (userId: string) => db.user.delete({ where: { id: userId } }),
};
