'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject, handleError } from '../utils';
import { CafeType } from '../../../types';
import { INSERT_CAFE_SCHEMA } from '../validator';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';

export const cafeList = async ({ limit }: { limit?: number }) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.cafe.findMany({
      take: limit || 10,
      include: {
        addresses: {
          where: { isDefault: true },
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
      where: {
        isFeature: true,
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

export const getCafeByCafeOwner = async (id: string) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.cafe.findMany({
      where: {
        ownerId: id,
      },
      orderBy: { createdAt: 'asc' },
    });
    return converToPlanObject(data);
  } catch (error) {
    console.error('Failed to fetch cafes:', error);
    return []; // fallback value
  }
};

export const getCafeByCafeOwnerById = async (id: string, cafeId: string) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.cafe.findFirst({
      where: {
        ownerId: id,
        id: cafeId,
      },
      orderBy: { createdAt: 'asc' },
    });
    return converToPlanObject(data);
  } catch (error) {
    console.error('Failed to fetch cafes:', error);
    return []; // fallback value
  }
};

export const createCafe = async (payload: CafeType) => {
  const prisma = new PrismaClient();

  try {
    // This line can throw a ZodError
    const cafe = INSERT_CAFE_SCHEMA.parse({ ...payload });

    const session = await getServerSession(authOptions);
    if (
      !session?.user?.id ||
      (session.user.role !== 'super_admin' && session.user.role !== 'owner')
    ) {
      return {
        success: false,
        message: 'You do not have permission to create a cafe.',
      };
    }

    // If Zod passes, create the cafe
    const response = await prisma.cafe.create({
      data: {
        name: cafe.name,
        closeTime: cafe.closeTime,
        openTime: cafe.openTime,
        themeColor: cafe.themeColor,
        logo: cafe.logo,
        isActive: false,
        isFeature: false,
        subTitle: cafe.subTitle,
        owner: { connect: { id: session.user.id } },
      },
    });

    // ✅ No need to call handleError here
    return {
      success: true,
      message: `Cafe "${response.name}" created successfully!`,
    };
  } catch (error) {
    // This will now catch ZodError, Prisma errors, or any other error
    const err = handleError(error);
    return {
      success: false,
      message: err.message,
      details: err.details, // includes the Zod path/messages
    };
  }
};

export const updateCafe = async (payload: CafeType, id: string) => {
  const prisma = new PrismaClient();

  try {
    const cafe = INSERT_CAFE_SCHEMA.parse({ ...payload });

    const session = await getServerSession(authOptions);
    if (
      !session?.user?.id ||
      (session.user.role !== 'super_admin' && session.user.role !== 'owner')
    ) {
      return {
        success: false,
        message: 'You do not have permission to create a cafe.',
      };
    }
    const response = await prisma.cafe.update({
      data: {
        ...cafe,
      },
      where: {
        id: id,
        ownerId: session.user.id,
      },
    });

    // ✅ No need to call handleError here
    return {
      success: true,
      message: `Cafe "${response.name}" updated successfully!`,
    };
  } catch (error) {
    // This will now catch ZodError, Prisma errors, or any other error
    const err = handleError(error);
    return {
      success: false,
      message: err.message,
      details: err.details, // includes the Zod path/messages
    };
  }
};

export const deleteCafe = async (cafeId: string) => {
  const prisma = new PrismaClient();
  if (!cafeId) {
    return {
      success: false,
      message: 'Missing prams please check again',
    };
  }

  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.id ||
      (session.user.role !== 'super_admin' && session.user.role !== 'owner')
    ) {
      return {
        success: false,
        message: 'You do not have permission to create a cafe.',
      };
    }
    const response = await prisma.cafe.delete({
      where: {
        id: cafeId,
        ownerId: session.user.id,
      },
    });

    return {
      success: true,
      message: `Cafe "${response.name}" deleted successfully!`,
    };
  } catch (error) {
    const err = handleError(error);
    return {
      success: false,
      message: err.message,
      details: err.details, // includes the Zod path/messages
    };
  }
};
