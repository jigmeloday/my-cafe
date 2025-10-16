import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';
import { INSERT_MENU_BE_SCHEMA } from '@/lib/validator';
import { prisma } from '@/lib/prisma';
import { getQueryParams } from '@/lib/utils';

export async function POST(req: NextRequest) {
  let userId: string | undefined;

  try {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    userId = session?.user?.id;

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

    // Fetch user cafes and role in one go
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cafes: { select: { id: true, isActive: true } },
        role: { select: { name: true } },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'We couldn’t find your account. Please sign in again.',
        },
        { status: 404 }
      );
    }

    const userCafeIds = user.cafes.map((c) => c.id);
    if (!userCafeIds.includes(menuData.cafeId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only create menus for your own cafes.',
        },
        { status: 403 }
      );
    }

    const cafe = user.cafes.find((c) => c.id === menuData.cafeId);
    if (!cafe?.isActive) {
      return NextResponse.json(
        { success: false, message: 'Cannot create menu for an inactive cafe.' },
        { status: 403 }
      );
    }

    // Use a transaction for menu + images
    const { imageUrls, ...menuDataWithoutImages } = menuData;

    const newMenu = await prisma.$transaction(async (tx) => {
      const createdMenu = await tx.menu.create({
        data: {
          ...menuDataWithoutImages,
          Images: {
            create: imageUrls?.map((url) => ({ url })) || [],
          },
        },
      });
      return createdMenu;
    });

    return NextResponse.json(
      {
        success: true,
        message: '🎉 Menu successfully created!',
        data: newMenu,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Menu creation error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error || 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    // 🧹 Close Prisma connection explicitly in dev mode
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
        where: { ownerId: userId }
      });

      const verifiedCafe = cafes.find(c => c.id === cafeId);

      menuList = await prisma.menu.findMany({
        where: {
          categoryId: category || undefined,
          cafeId: verifiedCafe?.id || undefined
        },
        skip,
        take: limit,
        include: { Images: true }
      });
    } else {
      menuList = await prisma.menu.findMany({
        where: {
          archived: false,
          categoryId: category || undefined,
          cafeId: cafeId || undefined
        },
        skip,
        take: limit,
        include: { Images: true }
      });
    }

    return NextResponse.json({ success: true, data: menuList }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu list:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
