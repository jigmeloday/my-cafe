import { db } from "@/lib/db";

/** Database access for favorites, follows and notifications. Rules live in services/engagement. */
export const engagementRepository = {
  favorites: (userId: string) =>
    db.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { href: true } }),
  follows: (userId: string) =>
    db.follow.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: { href: true } }),

  countFavorites: (userId: string) => db.favorite.count({ where: { userId } }),
  countFollows: (userId: string) => db.follow.count({ where: { userId } }),

  addFavorite: (userId: string, href: string) =>
    db.favorite.upsert({ where: { userId_href: { userId, href } }, create: { userId, href }, update: {} }),
  removeFavorite: (userId: string, href: string) => db.favorite.deleteMany({ where: { userId, href } }),

  addFollow: (userId: string, href: string) =>
    db.follow.upsert({ where: { userId_href: { userId, href } }, create: { userId, href }, update: {} }),
  removeFollow: (userId: string, href: string) => db.follow.deleteMany({ where: { userId, href } }),

  notifications: (userId: string, limit?: number) =>
    db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: limit }),
};
