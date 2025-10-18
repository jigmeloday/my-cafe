import { Prisma } from '@/generated/prisma';
import { getQueryParams, normalizeHour, parseBoolean } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';
import { INSERT_CAFE_BE_SCHEMA } from '@/lib/validator';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const userId = session?.user?.id;

  const url = new URL(req.url);
  const { active, closed, feature, openTime, closeTime, search, sort, discount } =
    getQueryParams(url, [
      'active',
      'closed',
      'feature',
      'openTime',
      'closeTime',
      'search',
      'discount',
      'sort',
    ]);

  const limit = Number(url.searchParams.get('limit') ?? 8);
  const page = Number(url.searchParams.get('page') ?? 1);
  const offset = (page - 1) * limit;
  const openTimeFilter = normalizeHour(openTime);
  const closeTimeFilter = normalizeHour(closeTime);
  const sortOrder: Prisma.SortOrder = sort === 'asc' ? 'asc' : 'desc';

  // ------------------ WHERE CLAUSE ------------------
 // ------------------ WHERE CLAUSE ------------------
const where: Prisma.CafeWhereInput = {
  ...(userRole === 'super_admin'
    ? active !== undefined
      ? { isActive: parseBoolean(active) }
      : {}
    : userRole === 'owner'
    ? {
        ownerId: userId,
        ...(active !== undefined && { isActive: parseBoolean(active) }),
      }
    : { isActive: true }),

  closed: parseBoolean(closed),
  isFeature: parseBoolean(feature),

  ...(openTimeFilter && {
    openTime: { contains: openTimeFilter, mode: 'insensitive' },
  }),
  ...(closeTimeFilter && {
    closeTime: { contains: closeTimeFilter, mode: 'insensitive' },
  }),
  ...(search && {
    OR: [
      { name: { contains: search, mode: 'insensitive' } },
      { subTitle: { contains: search, mode: 'insensitive' } },
    ],
  }),

  // 🟢 Include discount filter
  ...(discount === 'true' && {
    menus: {
      some: {
        discount: { not: null },
      },
    },
  }),
};

  try {
    const [cafes, totalCount] = await Promise.all([
      prisma.cafe.findMany({
        skip: offset,
        take: limit,
        where,
        orderBy: { createdAt: sortOrder },
        include: {
          addresses: true,
          menus: true,
          owner: { select: { name: true, email: true } },
        },
      }),
      prisma.cafe.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: cafes,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error ?? 'Failed to fetch cafes' },
      { status: 500 }
    );
  } 
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const parsed = INSERT_CAFE_BE_SCHEMA.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request data', details: parsed.error.format() },
      { status: 400 }
    );
  }
  const cafeData = parsed.data;

  if (!cafeData.agreeTerms) {
    return NextResponse.json(
      {
        success: false,
        message: 'Please agree to the terms and conditions before continuing.',
      },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      {
        success: false,
        message: 'You need to be signed in to perform this action.',
      },
      { status: 401 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        cafeCreation: true,
        roleId: true,
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
    const roles = await prisma.role.findMany({
      where: {
        name: { in: ['super_admin', 'owner'] },
      },
      select: { id: true, name: true },
    });
    const allowedRoleIds = roles.map((r) => r.id);

    if (!allowedRoleIds.includes(user.roleId) || !user.cafeCreation) {
      return NextResponse.json({ error: 'Permission denied' }, { status: 403 });
    }

    const newCafe = await prisma.cafe.create({
      data: {
        ...cafeData,
        ownerId: user.id,
      },
    });
    return NextResponse.json(
      {
        success: true,
        message: `🎉 Congratulations! Your cafe "${newCafe.name}" is now open and ready to welcome guests!`,
        data: newCafe,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong on our end. Please try again later.',
      },
      { status: 500 }
    );
  }
}
