import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

/** Database access for a business's own profile. No rules live here: see services/business. */
export const businessRepository = {
  /** The owner's business (the oldest one, if they somehow have several). */
  findByOwner: (ownerId: string) =>
    db.business.findFirst({ where: { ownerId }, orderBy: { createdAt: "asc" } }),

  findById: (id: string) => db.business.findUnique({ where: { id } }),

  findBySlug: (slug: string) => db.business.findUnique({ where: { slug } }),

  slugTaken: async (slug: string) => (await db.business.count({ where: { slug } })) > 0,

  create: (data: Prisma.BusinessUncheckedCreateInput) => db.business.create({ data }),

  /** Updates only the owner's own business, so one owner can never change another's. */
  update: (id: string, ownerId: string, data: Prisma.BusinessUncheckedUpdateInput) =>
    db.business.updateMany({ where: { id, ownerId }, data }),
};
