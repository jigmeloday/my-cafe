'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject, handleError } from '../utils';
import { CafeType } from '../../../types';
import { INSERT_CAFE_SCHEMA } from '../validator';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { uploadImage } from '../services/image-upload-api';
import DOMPurify from 'isomorphic-dompurify';

export const topRatedCafeList = async () => {
  const prisma = new PrismaClient();
  try {
    const cafes = await prisma.cafe.findMany({
      take: 4,
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    return converToPlanObject(cafes);
  } catch (error) {
    console.error('Failed to fetch cafes:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};

export const getCafeByCafeOwner = async () => {
  const prisma = new PrismaClient();
  const session = await getServerSession(authOptions);
  try {
    const data = await prisma.cafe.findMany({
      where: {
        ownerId: session?.user.id,
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

export const topRatedDiscount = async () => {
  const prisma = new PrismaClient();

  try {
    const cafes = await prisma.menu.findMany({
      where: {
        discount: {
          not: null,
          gt: 0, // Only include menus that actually have a discount
        },
      },
      orderBy: {
        discount: 'desc', // Sort by highest discount first
      },
      take: 4, // Limit to top 4 discounted items
      include: {
        Images: true,
        cafe: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return converToPlanObject(cafes);
  } catch (error) {
    console.error('Failed to fetch top discounted menus:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};




// export const menuList = async ({ limit }: { limit?: number }) => {
//   const prisma = new PrismaClient();
//   try {
//     const data = await prisma.menu.findMany({
//       take: limit || 10,
//       include: {
//         cafe: {
//           select: {
//             name: true, // fetch only the cafe name
//           },
//         },
//       },
//       orderBy: { createdAt: 'asc' },
//     });
//     return converToPlanObject(data);
//   } catch (error) {
//     console.error('Failed to fetch cafes:', error);
//     return []; // fallback value
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// export const getFeature = async () => {
//   const prisma = new PrismaClient();
//   try {
//     const data = await prisma.cafe.findMany({
//       where: {
//         isFeature: true,
//         isActive: true,
//       },
//       orderBy: { createdAt: 'asc' },
//     });
//     return converToPlanObject(data);
//   } catch (error) {
//     console.error('Failed to fetch cafes:', error);
//     return []; // fallback value
//   } finally {
//     await prisma.$disconnect();
//   }
// };



// export const getCafeByCafeOwnerById = async (
//   cafeId: string
// ): Promise<CafeType | null> => {
//   const prisma = new PrismaClient();
//   try {
//     const data = await prisma.cafe.findFirst({
//       where: { id: cafeId },
//       include: {
//         Addresses: {
//           select: {
//             id: true,
//             street: true,
//             city: true,
//             country: true,
//           },
//         },
//       },
//     });

//     if (!data) {
//       return null; // cafe not found
//     }

//     return converToPlanObject(data) as CafeType;
//   } catch (error) {
//     console.error('Failed to fetch cafe:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// export const createCafe = async (payload: CafeType) => {
//   const prisma = new PrismaClient();

//   try {
//     const cafe = INSERT_CAFE_SCHEMA.parse({ ...payload });
//     const session = await getServerSession(authOptions);
//     if (!cafe.agreeTerms)
//       return {
//         success: false,
//         message: 'Need to agree terms and conditions',
//       };
//     if (
//       !session?.user?.id ||
//       (session.user.role !== 'super_admin' && session.user.role !== 'owner')
//     ) {
//       return {
//         success: false,
//         message: 'You do not have permission to create a cafe.',
//       };
//     }

    // let logoUrl = '';
    // if (cafe.logo) {
    //   const uploadedUrl = await uploadImage(cafe.logo as File, 'logo');
    //   if (uploadedUrl) {
    //     logoUrl = uploadedUrl;
    //   } else {
    //     return {
    //       success: false,
    //       message: 'Image upload failed',
    //     };
    //   }
    // }
//     const response = await prisma.cafe.create({
//       data: {
//         name: DOMPurify.sanitize(cafe.name),
//         subTitle: DOMPurify.sanitize(cafe.subTitle),
//         description: DOMPurify.sanitize(cafe.description),
//         website: cafe.website || null,
//         phone: cafe.phone || '',
//         email: cafe.email || '',
//         socialLinks: cafe.socialLinks || null,
//         googleMap: cafe.googleMap || null,
//         logo: logoUrl || null,
//         openTime: cafe.openTime,
//         closeTime: cafe.closeTime,
//         themeColor: cafe.themeColor,
//         agreeTerms: cafe.agreeTerms,
//         isFeature: cafe.isFeature ?? false,
//         closed: cafe.closed ?? false,
//         isActive: cafe.isActive ?? false,
//         ownerId: session.user.id,
//       },
//     });

//     return {
//       success: true,
//       message: `Cafe "${response.name}" created successfully!`,
//       data: response,
//     };
//   } catch (error) {
//     const err = handleError(error);
//     return {
//       success: false,
//       message: err.message,
//       details: err.details,
//     };
//   }
// };

// export const updateCafe = async (id: string, payload: Partial<CafeType>) => {
//   const prisma = new PrismaClient();

//   try {
//     // 1️⃣ Validate data with Zod
//     const cafe = INSERT_CAFE_SCHEMA.parse({ ...payload });

//     // 2️⃣ Check that user agreed to terms
//     if (!cafe.agreeTerms) {
//       return {
//         success: false,
//         message:
//           'You must agree to the terms and conditions to update the cafe.',
//       };
//     }

//     // 3️⃣ Validate session and role
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return {
//         success: false,
//         message: 'You must be logged in to update a cafe.',
//       };
//     }

//     const isSuperAdmin = session.user.role === 'super_admin';

//     // 4️⃣ Fetch existing cafe
//     const existing = await prisma.cafe.findUnique({ where: { id } });
//     if (!existing) return { success: false, message: 'Cafe not found.' };

//     if (!isSuperAdmin && existing.ownerId !== session.user.id) {
//       return {
//         success: false,
//         message: 'You cannot update a cafe you do not own.',
//       };
//     }

//     // 5️⃣ Handle secure logo upload
//     let logoUrl = existing.logo ?? null;
//     if (
//       cafe.logo &&
//       typeof cafe.logo !== 'string' &&
//       cafe.logo instanceof File
//     ) {
//       if (
//         !['image/jpeg', 'image/png', 'image/svg+xml'].includes(cafe.logo.type)
//       ) {
//         return { success: false, message: 'Invalid image type.' };
//       }
//       if (cafe.logo.size > 10 * 1024 * 1024) {
//         return { success: false, message: 'Image size exceeds 10MB.' };
//       }

//       const uploadedUrl = await uploadImage(cafe.logo, 'logo');
//       if (!uploadedUrl)
//         return { success: false, message: 'Image upload failed.' };
//       logoUrl = uploadedUrl;
//     } else if (typeof cafe.logo === 'string') {
//       logoUrl = cafe.logo;
//     }
//     // 6️⃣ Sanitize strings to prevent XSS
//     const sanitizedData = {
//       name: DOMPurify.sanitize(cafe.name ?? existing.name),
//       subTitle: DOMPurify.sanitize(cafe.subTitle ?? existing.subTitle),
//       description: DOMPurify.sanitize(cafe.description ?? existing.description),
//       website: cafe.website ?? existing.website,
//       phone: cafe.phone ?? existing.phone,
//       email: cafe.email ?? existing.email,
//       socialLinks: cafe.socialLinks ?? existing.socialLinks,
//       googleMap: cafe.googleMap ?? existing.googleMap,
//       openTime: cafe.openTime ?? existing.openTime,
//       closeTime: cafe.closeTime ?? existing.closeTime,
//       themeColor: cafe.themeColor ?? existing.themeColor,
//       logo: logoUrl,
//       agreeTerms: cafe.agreeTerms, // must be true
//       isFeature: cafe.isFeature ?? existing.isFeature,
//       closed: cafe.closed ?? existing.closed,
//       isActive: cafe.isActive ?? existing.isActive,
//     };

//     // 7️⃣ Update the cafe securely
//     const updatedCafe = await prisma.cafe.update({
//       where: { id },
//       data: sanitizedData,
//     });

//     return {
//       success: true,
//       message: `Cafe "${updatedCafe.name}" updated successfully!`,
//       data: updatedCafe,
//     };
//   } catch (error) {
//     const err = handleError(error);
//     return { success: false, message: err.message, details: err.details };
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// export const deleteCafe = async (cafeId: string) => {
//   const prisma = new PrismaClient();
//   if (!cafeId) {
//     return {
//       success: false,
//       message: 'Missing prams please check again',
//     };
//   }

//   try {
//     const session = await getServerSession(authOptions);
//     if (
//       !session?.user?.id ||
//       (session.user.role !== 'super_admin' && session.user.role !== 'owner')
//     ) {
//       return {
//         success: false,
//         message: 'You do not have permission to create a cafe.',
//       };
//     }
//     const response = await prisma.cafe.delete({
//       where: {
//         id: cafeId,
//         ownerId: session.user.id,
//       },
//     });

//     return {
//       success: true,
//       message: `Cafe "${response.name}" deleted successfully!`,
//     };
//   } catch (error) {
//     const err = handleError(error);
//     return {
//       success: false,
//       message: err.message,
//       details: err.details, // includes the Zod path/messages
//     };
//   }
// };
