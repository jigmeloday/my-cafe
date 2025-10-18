import prisma from '../src/generated/prisma';
import { BANNER_DATA } from './sample-data';

export const seedBanners = async (cafeMap: Record<string, string>) => {
  for (const bannerEntry of BANNER_DATA) {
    const cafeId = cafeMap[bannerEntry.cafeName];
    if (!cafeId) continue;

    for (const banner of bannerEntry.banners) {
      await prisma.banner.create({
        data: {
          cafeId,
          buttonText: banner.buttonText,
          link: banner.link,
          active: banner.active,
          title: banner.title,
          subtitle: banner.subtitle,
          imageUrl: banner.imageUrl,
          startDate: banner.startDate,
          endDate: banner.endDate,
        },
      });
    }
    console.log(`🎉 Banners added for ${bannerEntry.cafeName}`);
  }
};
