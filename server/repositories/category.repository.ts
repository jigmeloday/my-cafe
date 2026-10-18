import { db } from "@/lib/db";

export const categoryRepository = {
  listWithCounts: () =>
    db.category.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { promotions: true } } } }),

  list: () => db.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),

  findByName: (name: string) => db.category.findFirst({ where: { name: { equals: name, mode: "insensitive" } } }),

  slugTaken: async (slug: string) => (await db.category.count({ where: { slug } })) > 0,

  create: (name: string, slug: string) => db.category.create({ data: { name, slug } }),

  rename: (id: string, name: string) => db.category.update({ where: { id }, data: { name } }),

  async remove(id: string) {
    const { count } = await db.category.deleteMany({ where: { id } });
    return count;
  },
};
