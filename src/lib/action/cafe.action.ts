'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject, handleError } from '../utils';
import { CafeType } from '../../../types';
import { INSERT_CAFE_SCHEMA } from '../validator';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { uploadImage } from '../services/image-upload-api';

export const cafeList = async ({ limit }: { limit?: number }) => {
  const prisma = new PrismaClient();
  try {
    const data = await prisma.cafe.findMany({
      take: limit || 10,
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
      take: 10,
      orderBy: { createdAt: 'desc' },
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

    let logoUrl = '';
    if (cafe.logo) {
      const uploadedUrl = await uploadImage(cafe.logo as File, 'logo');
      if (uploadedUrl) {
        logoUrl = uploadedUrl;
      } else {
        console.log(logoUrl);

        return {
          success: false,
          message: 'Image upload failed',
        };
      }
    }

    const response = await prisma.cafe.create({
      data: {
        name: cafe.name,
        closeTime: cafe.closeTime,
        openTime: cafe.openTime,
        themeColor: cafe.themeColor,
        logo: logoUrl,
        isActive: false,
        isFeature: false,
        subTitle: cafe.subTitle,
        owner: { connect: { id: session.user.id } },
      },
    });
    return {
      success: true,
      message: `Cafe "${response.name}" created successfully!`,
      data: response,
    };
  } catch (error) {
    const err = handleError(error);
    return {
      success: false,
      message: err.message,
      details: err.details,
    };
  }
};

export const updateCafe = async (id: string, payload: Partial<CafeType>) => {
  const prisma = new PrismaClient();

  try {
    // 1️⃣ Parse and validate data
    const cafe = INSERT_CAFE_SCHEMA.parse({ ...payload });;
    const session = await getServerSession(authOptions);
    if (
      !session?.user?.id ||
      (session.user.role !== 'super_admin' && session.user.role !== 'owner')
    ) {
      return {
        success: false,
        message: 'You do not have permission to update this cafe.',
      };
    }

    const existing = await prisma.cafe.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, message: 'Cafe not found.' };
    }
    if (
      session.user.role !== 'super_admin' &&
      existing.ownerId !== session.user.id
    ) {
      return {
        success: false,
        message: 'You cannot update a cafe you do not own.',
      };
    }

    // 4️⃣ Handle optional logo upload
    let logoUrl = existing.logo || '';
    if (
      cafe.logo &&
      typeof cafe.logo !== 'string' &&
      cafe.logo instanceof File
    ) {
      const uploadedUrl = await uploadImage(cafe.logo, 'logo');
      if (uploadedUrl) {
        logoUrl = uploadedUrl;
      } else {
        return { success: false, message: 'Image upload failed.' };
      }
    }

    // 5️⃣ Update the record
    const updatedCafe = await prisma.cafe.update({
      where: { id },
      data: {
        closed: cafe.closed ?? existing.closed,
        name: cafe.name ?? existing.name,
        subTitle: cafe.subTitle ?? existing.subTitle,
        openTime: cafe.openTime ?? existing.openTime,
        closeTime: cafe.closeTime ?? existing.closeTime,
        themeColor: cafe.themeColor ?? existing.themeColor,
        logo: logoUrl,
      },
    });

    // 6️⃣ Success response
    return {
      success: true,
      message: `Cafe "${updatedCafe.name}" updated successfully!`,
      data: updatedCafe,
    };
  } catch (error) {
    const err = handleError(error);
    return {
      success: false,
      message: err.message,
      details: err.details,
    };
  } finally {
    await prisma.$disconnect();
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
