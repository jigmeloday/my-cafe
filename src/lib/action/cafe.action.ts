'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject } from '../utils';


export const cafeList = async ({ limit }: { limit?: number }) => {
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

export const menuList = async ({ limit }: { limit?: number }) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.menu.findMany({
      take: limit || 10,
      include: {
      cafe: {
          select: {
            name: true, // fetch only the cafe name
          },
        },
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


export const getFeature = async () => {
   const prisma = new PrismaClient();
   try {
    const data = await prisma.cafe.findMany({
      where:{
        isFeature: true
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
}