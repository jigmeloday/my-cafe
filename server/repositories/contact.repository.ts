import { db } from "@/lib/db";

export const contactRepository = {
  create: (data: { name: string; email: string; topic: string; message: string; userId: string | null }) =>
    db.contactMessage.create({ data }),

  /** Newest first. Waiting ones are shown first in the inbox by the caller. */
  list: (status: "OPEN" | "DONE" | "ALL") =>
    db.contactMessage.findMany({ where: status === "ALL" ? {} : { status }, orderBy: { createdAt: "desc" }, take: 200 }),

  countOpen: () => db.contactMessage.count({ where: { status: "OPEN" } }),

  /** Marks a waiting message as dealt with. Returns false when it wasn't waiting (already done, or not found). */
  async markDone(id: string, adminId: string, now: Date) {
    const { count } = await db.contactMessage.updateMany({ where: { id, status: "OPEN" }, data: { status: "DONE", handledById: adminId, handledAt: now } });
    return count > 0;
  },
};
