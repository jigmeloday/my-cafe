import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';
import { INSERT_BANNER_BE_SCHEMA } from '@/lib/validator';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
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
        { success: false, message: 'Invalid request data', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { cafeId, ...bannerData } = parsed.data;

    // Fetch user, roles, and cafes in parallel to reduce latency
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

    // Security check: restrict to certain roles
    const allowedRoleIds = roles.map((r) => r.id);
    const isAuthorized = allowedRoleIds.includes(user.roleId) && user.cafeCreation;

    if (!isAuthorized) {
      return NextResponse.json({ success: false, message: 'Permission denied.' }, { status: 403 });
    }

    // Check cafe ownership efficiently
    const ownsCafe = await prisma.cafe.findFirst({
      where: { id: cafeId, ownerId: user.id },
      select: { id: true },
    });

    if (!ownsCafe) {
      return NextResponse.json({ success: false, message: 'Permission denied.' }, { status: 403 });
    }

    // Create banner
    const banner = await prisma.banner.create({
      data: {
        ...bannerData,
        cafeId,
        creatorId: user.id,
        buttonText: bannerData.buttonText ?? ''
      },
      select: { id: true, title: true, createdAt: true, subtitle: true, startDate: true, endDate:true, link: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: `🎉 Banner for cafe "${banner.title}" created successfully!`,
        data: banner,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /banner error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error. Please try again later.' },
      { status: 500 }
    );
  }
}
