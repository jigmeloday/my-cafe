import { INSERT_CAFE_BE_SCHEMA } from '@/lib/validator';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../../auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const url = new URL(req.url);
  const pathSegments = url.pathname.split('/');
  const cafeId = pathSegments[pathSegments.length - 1];
  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'You must be signed in to update a cafe.' },
      { status: 401 }
    );
  }

  const parsed = INSERT_CAFE_BE_SCHEMA.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid request data',
        details: parsed.error.format(),
      },
      { status: 400 }
    );
  }

  const cafeData = parsed.data;
  if (!cafeData.agreeTerms) {
    return NextResponse.json(
      {
        success: false,
        message: 'You must agree to the terms and conditions.',
      },
      { status: 400 }
    );
  }

  try {
    // Fetch the cafe to ensure it exists and user is allowed to update it
    const existingCafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      select: { id: true, ownerId: true },
    });

    if (!existingCafe) {
      return NextResponse.json(
        { success: false, message: 'Cafe not found.' },
        { status: 404 }
      );
    }

    // Authorization check
    if (userRole !== 'super_admin' && existingCafe.ownerId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to update this cafe.',
        },
        { status: 403 }
      );
    }

    // Update the cafe
    const updatedCafe = await prisma.cafe.update({
      where: { id: existingCafe.id },
      data: {
        name: cafeData.name,
        subTitle: cafeData.subTitle,
        description: cafeData.description,
        themeColor: cafeData.themeColor,
        openTime: cafeData.openTime,
        closeTime: cafeData.closeTime,
        closed: cafeData.closed,
        isFeature: cafeData.isFeature,
        website: cafeData.website,
        phone: cafeData.phone,
        email: cafeData.email,
        socialLinks: cafeData.socialLinks,
        googleMap: cafeData.googleMap,
        logo: cafeData.logo,
      },
    });

    return NextResponse.json({
      success: true,
      message: `✅ Cafe "${updatedCafe.name}" has been updated successfully.`,
      data: updatedCafe,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error || 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { cafeId: string } }
) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const { cafeId } = params;

  try {
    const userId = session?.user?.id;
    if (!cafeId) {
      return NextResponse.json(
        { success: false, message: 'Not found.' },
        { status: 404 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'You need to be signed in.' },
        { status: 401 }
      );
    }

    // Fetch user from DB to get real role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Fetch the cafe
    const existingCafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
      select: { ownerId: true },
    });

    if (!existingCafe) {
      return NextResponse.json(
        { success: false, message: 'Cafe not found.' },
        { status: 404 }
      );
    }

    // Check permission: super_admin OR owner
    if (userRole !== 'super_admin' && existingCafe.ownerId !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'You do not have permission to delete this cafe.',
        },
        { status: 403 }
      );
    }

    // Perform delete
    await prisma.cafe.delete({ where: { id: cafeId } });

    return NextResponse.json(
      { success: true, message: 'Cafe deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error || 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: { cafeId: string } }
) {
  try {
    const { cafeId } = await params;

    const cafe = await prisma.cafe.findUnique({
      where: { id: cafeId },
    });

    if (!cafe) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cafe not found',
        },
        { status: 404 }
      );
    }

    // Return the found cafe
    return NextResponse.json({
      success: true,
      message: 'Cafe found',
      data: cafe,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again later',
      },
      { status: 500 }
    );
  }
}
