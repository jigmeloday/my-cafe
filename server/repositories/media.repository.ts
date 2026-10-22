import { db } from "@/lib/db";

/** Whether a stored picture is in use by a promotion or a banner. */
export const mediaRepository = {
  async isReferenced(key: string): Promise<boolean> {
    const [promotions, banners] = await Promise.all([
      db.promotion.count({ where: { photos: { has: key } } }),
      db.banner.count({ where: { imageKey: key } }),
    ]);
    return promotions + banners > 0;
  },
};
