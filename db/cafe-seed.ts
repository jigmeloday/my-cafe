import prisma from '../src/generated/prisma';
import { CAFE_DATA } from './sample-data';

export const seedCafes = async (ownerId: string) => {
  const cafeMap: Record<string, string> = {};
  console.log('🌱 Starting database seeding...');

  for (const cafeData of CAFE_DATA) {
    const cafe = await prisma.cafe.create({
      data: {
        name: cafeData.name,
        subTitle: cafeData.subTitle,
        logo: cafeData.logo,
        openTime: cafeData.openTime,
        closeTime: cafeData.closeTime,
        themeColor: cafeData.themeColor,
        isFeature: cafeData.isFeature,
        ownerId,
      },
    });

    cafeMap[cafe.name] = cafe.id;
    console.log(`☕ Created cafe: ${cafe.name}`);
  }

  return cafeMap;
};
