import { PrismaClient, Prisma } from '@/generated/prisma';
import { getQueryParams, normalizeHour, parseBoolean } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userRole = session?.user?.role;
  const url = new URL(req.url);
  const { active, closed, feature, openTime, closeTime, search, sort } =
    getQueryParams(url, [
      'active',
      'closed',
      'feature',
      'openTime',
      'closeTime',
      'search',
      'sort',
    ]);
  const limit = Number(url.searchParams.get('limit') ?? 8);
  const page = Number(url.searchParams.get('page') ?? 1);
  const offset = (page - 1) * limit;
  const openTimeFilter = normalizeHour(openTime);
  const closeTimeFilter = normalizeHour(closeTime);
  const sortOrder: Prisma.SortOrder = sort === 'asc' ? 'asc' : 'desc';

  const where: Prisma.CafeWhereInput = {
    isActive: userRole === 'super_admin' ? parseBoolean(active, true) : true,
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
  };

  const [cafes, totalCount] = await Promise.all([
    prisma.cafe.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy: { createdAt: sortOrder },
    }),
    prisma.cafe.count({ where }),
  ]);

  // Fetch average stars (out of 5) for each cafe
  const cafesWithStars = await Promise.all(
    cafes.map(async (cafe) => {
      const aggregate = await prisma.review.aggregate({
        _sum: { rating: true },
        _count: { rating: true },
        where: { reviewableType: 'cafe', reviewableId: cafe.id },
      });

      const totalRating = aggregate._sum.rating || 0;
      const reviewCount = aggregate._count.rating || 0;
      const averageStars = reviewCount > 0 ? totalRating / reviewCount : 0;

      return {
        ...cafe,
        totalStars: averageStars, // average rating out of 5
        reviewCount,
      };
    })
  );

  return NextResponse.json({ cafes: cafesWithStars, totalCount });
}
