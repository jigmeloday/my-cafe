import { PrismaClient } from '@/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';

const prisma = new PrismaClient();

type CafeReview = {
  id: string;
  rating?: number | null;
  comment?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const cafeId = url.searchParams.get('cafeId');

    if (!cafeId) {
      return NextResponse.json({ success: false, message: 'Cafe ID is required' }, { status: 400 });
    }

    const limit = Number(url.searchParams.get('limit') ?? 10);
    const page = Number(url.searchParams.get('page') ?? 1);
    const offset = (page - 1) * limit;

    // Fetch paginated reviews
    const reviewsRaw = await prisma.review.findMany({
      where: { reviewableType: 'cafe', reviewableId: cafeId },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, image: true } },
      },
    });

    // Convert dates for JSON
    const reviews: CafeReview[] = reviewsRaw.map(r => ({
      id: r.id,
      rating: r.rating ?? null,
      comment: r.comment ?? null,
      createdAt: r.createdAt.toISOString(),
      user: {
        id: r.user.id,
        name: r.user.name ?? null,
        image: r.user.image ?? null,
      },
    }));

    // Count total reviews
    const totalReviews = await prisma.review.count({
      where: { reviewableType: 'cafe', reviewableId: cafeId },
    });

    // Calculate star breakdown
    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsRaw.forEach(r => {
      if (r.rating && r.rating >= 1 && r.rating <= 5) {
        starCounts[r.rating] += 1;
      }
    });

    // Calculate percentages
    const starPercentages: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      starPercentages[i] = totalReviews ? Math.round((starCounts[i] / totalReviews) * 100) : 0;
    }

    // Calculate overall average rating
    const overallScore =
      totalReviews > 0
        ? reviewsRaw.reduce((acc, r) => acc + (r.rating || 0), 0) / totalReviews
        : 0;

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        total: totalReviews,
        page,
        limit,
        totalPages: Math.ceil(totalReviews / limit),
      },
      ratings: {
        starCounts,      // {5: 10, 4: 5, ...}
        starPercentages, // {5: 50, 4: 25, ...}
        overallScore: parseFloat(overallScore.toFixed(1)), // e.g., 4.3
      },
    });
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { stars, comment, reviewableId, reviewableType } = body;
    if (session?.user?.role === 'owner') {
      return NextResponse.json(
        { success: false, message: 'Cafe owners are not permitted to perform this action.' },
        { status: 400 }
      );
    }
  if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    // Basic validation
    if (!reviewableId || !stars || !session?.user.id) {
      return NextResponse.json(
        { success: false, message: 'cafeId, stars, and uid are required' },
        { status: 400 }
      );
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        userId: session?.user.id,
        reviewableType: reviewableType,
        reviewableId: reviewableId,
        rating: stars,
        comment,
      },
    });

    // Optional: recalculate cafe rating here if needed

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
