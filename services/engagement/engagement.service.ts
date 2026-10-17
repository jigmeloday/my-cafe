import { engagementRepository as repo } from "@/server/repositories/engagement.repository";

/** The most items one person can save or follow. Stops a script from filling the table. */
export const MAX_SAVED = 500;

const ADDRESS = /^\/(promotions|events|businesses)\/[a-z0-9-]{1,80}$/;

/** Only page addresses on this site are accepted. */
export const isValidHref = (href: string) => ADDRESS.test(href);

type Result = { ok: true } | { ok: false; error: string };
const TOO_MANY: Result = { ok: false, error: "You've reached the limit. Remove something first." };
const BAD_LINK: Result = { ok: false, error: "That item can't be saved." };

export const engagementService = {
  async snapshot(userId: string) {
    const [favorites, follows] = await Promise.all([repo.favorites(userId), repo.follows(userId)]);
    return { favorites: favorites.map((f) => f.href), following: follows.map((f) => f.href) };
  },

  counts: async (userId: string) => ({
    favorites: await repo.countFavorites(userId),
    following: await repo.countFollows(userId),
  }),

  async setFavorite(userId: string, href: string, saved: boolean): Promise<Result> {
    if (!isValidHref(href) || href.startsWith("/businesses/")) return BAD_LINK;
    if (!saved) return (await repo.removeFavorite(userId, href), { ok: true });
    if ((await repo.countFavorites(userId)) >= MAX_SAVED) return TOO_MANY;
    await repo.addFavorite(userId, href);
    return { ok: true };
  },

  async setFollow(userId: string, href: string, following: boolean): Promise<Result> {
    if (!href.startsWith("/businesses/") || !isValidHref(href)) return BAD_LINK;
    if (!following) return (await repo.removeFollow(userId, href), { ok: true });
    if ((await repo.countFollows(userId)) >= MAX_SAVED) return TOO_MANY;
    await repo.addFollow(userId, href);
    return { ok: true };
  },

  notifications: (userId: string, limit?: number) => repo.notifications(userId, limit),
};
