import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { INSERT_MENU_BE_SCHEMA } from '@/lib/validator';
import { prisma } from '@/lib/prisma';
import { authOptions } from '../../../../../auth';

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { slug } = await params;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'You need to be signed in to perform this action.',
        },
        { status: 401 }
      );
    }

    const parsed = INSERT_MENU_BE_SCHEMA.safeParse(body);
    if (parsed?.data && parsed?.data?.imageUrls?.length > 3) {
      return NextResponse.json(
        { success: false, message: 'You can upload a maximum of 3 images.' },
        { status: 400 }
      );
    }

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request data',
          details: parsed.error.format(),
        },
        { status: 400 }
      );
    }

    const menuData = parsed.data;
    const { imageUrls, ...menuDataWithoutImages } = menuData;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Menu ID is required for update.' },
        { status: 400 }
      );
    }

    // ✅ Check user ownership
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cafes: { select: { id: true, isActive: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please sign in again.' },
        { status: 404 }
      );
    }

    // ✅ Check if the menu belongs to user's cafe
    const existingMenu = await prisma.menu.findUnique({
      where: { id: slug },
      include: { cafe: true, Images: true },
    });

    if (!existingMenu) {
      return NextResponse.json(
        { success: false, message: 'Menu not found.' },
        { status: 404 }
      );
    }

    const userCafeIds = user.cafes.map((c) => c.id);
    if (!userCafeIds.includes(existingMenu.cafeId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only update menus for your own cafes.',
        },
        { status: 403 }
      );
    }

    const cafe = user.cafes.find((c) => c.id === existingMenu.cafeId);
    if (!cafe?.isActive) {
      return NextResponse.json(
        { success: false, message: 'Cannot update menu for an inactive cafe.' },
        { status: 403 }
      );
    }

    // ✅ Update transaction
    const updatedMenu = await prisma.$transaction(async (tx) => {
      // Update base menu info
      const menu = await tx.menu.update({
        where: { id: slug },
        data: {
          ...menuDataWithoutImages,
        },
      });

      // If new images are passed, replace existing
      if (imageUrls && imageUrls.length > 0) {
        // Delete existing images
        await tx.menuImage.deleteMany({
          where: { menuId: slug },
        });

        // Add new ones (limit to 3)
        await tx.menuImage.createMany({
          data: imageUrls.slice(0, 3).map((url) => ({
            url,
            menuId: slug,
          })),
        });
      }

      return menu;
    });

    return NextResponse.json(
      {
        success: true,
        message: '✅ Menu successfully updated!',
        data: updatedMenu,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Menu update error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  } finally {
    if (process.env.NODE_ENV === 'development') {
      await prisma.$disconnect();
    }
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const role = session?.user?.role;

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const cafeId = url.searchParams.get('cafeId');
    const category = url.searchParams.get('category');
    const myCafe = url.searchParams.get('myCafe') === 'true';

    if (myCafe && !cafeId) {
      return NextResponse.json(
        { success: false, message: 'Cafe id is required' },
        { status: 400 }
      );
    }

    let menuList;

    if (role === 'owner' || role === 'super_admin') {
      const cafes = await prisma.cafe.findMany({
        where: { ownerId: userId },
      });

      const verifiedCafe = cafes.find((c) => c.id === cafeId);

      menuList = await prisma.menu.findMany({
        where: {
          categoryId: category || undefined,
          cafeId: verifiedCafe?.id || undefined,
        },
        skip,
        take: limit,
        include: { Images: true },
      });
    } else {
      menuList = await prisma.menu.findMany({
        where: {
          archived: false,
          categoryId: category || undefined,
          cafeId: cafeId || undefined,
        },
        skip,
        take: limit,
        include: { Images: true },
      });
    }

    return NextResponse.json(
      { success: true, data: menuList },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching menu list:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}
