import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { NextRequest, NextResponse } from 'next/server';
import { INSERT_BANNER_BE_SCHEMA } from '@/lib/validator';
import prisma from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const updateId = pathSegments[pathSegments.length - 1];

  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = INSERT_BANNER_BE_SCHEMA.safeParse(body);

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

    const { cafeId, ...bannerData } = parsed.data;

    if (!updateId) {
      return NextResponse.json(
        { success: false, message: 'Banner ID is required for update.' },
        { status: 400 }
      );
    }

    // Fetch user and roles in parallel
    const [user, roles] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          cafeCreation: true,
          roleId: true,
          role: { select: { name: true } },
        },
      }),
      prisma.role.findMany({
        where: { name: { in: ['super_admin', 'owner'] } },
        select: { id: true },
      }),
    ]);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found. Please re-login.' },
        { status: 404 }
      );
    }

    // Authorization logic
    const allowedRoleIds = roles.map((r) => r.id);
    const isAuthorized = allowedRoleIds.includes(user.roleId) && user.cafeCreation;

    if (!isAuthorized) {
      return NextResponse.json(
        { success: false, message: 'Permission denied.' },
        { status: 403 }
      );
    }

    // Verify that banner exists and belongs to user's cafe
    const existingBanner = await prisma.banner.findUnique({
      where: { id: updateId },
      select: { id: true, cafeId: true, creatorId: true },
    });

    if (!existingBanner) {
      return NextResponse.json(
        { success: false, message: 'Banner not found.' },
        { status: 404 }
      );
    }

    // Ensure the user owns the cafe this banner belongs to
    const ownsCafe = await prisma.cafe.findFirst({
      where: { id: existingBanner.cafeId, ownerId: user.id },
      select: { id: true },
    });

    if (!ownsCafe) {
      return NextResponse.json(
        { success: false, message: 'Permission denied.' },
        { status: 403 }
      );
    }

    // Update the banner
    const updatedBanner = await prisma.banner.update({
      where: { id: updateId },
      data: {
        ...bannerData,
        buttonText: bannerData.buttonText ?? '',
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        active: true,
        cafeId: true,
        link: true,
        startDate: true,
        endDate: true,
        createdAt: true
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `✅ Banner "${updatedBanner.title}" updated successfully!`,
        data: updatedBanner,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT /banner error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
