'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject } from '../utils';


export const CafeList = async ({ limit }: { limit?: number }) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.cafe.findMany({
      take: limit || 10,
      include: {
        addresses: {
          where: { isDefault: true },
        }
      },
      orderBy: { createdAt: 'asc' },
    });
    return converToPlanObject(data);
  } catch (error) {
    console.error('Failed to fetch cafes:', error);
    return []; // fallback value
  } finally {
    await prisma.$disconnect();
  }
};
