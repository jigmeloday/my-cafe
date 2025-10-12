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
  const { active, closed, feature, openTime, closeTime, search } =
    getQueryParams(url, [
      'active',
      'closed',
      'feature',
      'openTime',
      'closeTime',
      'search',
    ]);
  const limit = Number(url.searchParams.get('limit') ?? 10);
  const page = Number(url.searchParams.get('page') ?? 1);
  const offset = (page - 1) * limit;
  const openTimeFilter = normalizeHour(openTime);
  const closeTimeFilter = normalizeHour(closeTime);

  const where: Prisma.CafeWhereInput = {
    isActive: userRole === 'super_admin' ? parseBoolean(active, true) : true,
    closed: parseBoolean(closed, false),
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
    orderBy: { createdAt: 'desc' },
  }),
  prisma.cafe.count({ where }), // use the same filters
]);

  return NextResponse.json({ cafes, totalCount });
}
