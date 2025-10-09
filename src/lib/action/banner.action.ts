import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject } from '../utils';
import { BannerType } from '../../../types';

export const getBanners = async (): Promise<BannerType[]> => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.banner.findMany({
      where: {
        active: true
      },
      include: {
        cafe: {
          select:{
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'asc' },
    });
    return converToPlanObject(data);
  } catch (error) {
    console.error('Failed to fetch cafes:', error);
    return []
  }
};
