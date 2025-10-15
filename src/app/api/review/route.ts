import { ReviewableType } from '@/generated/prisma/client';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../../../auth';
import prisma from '@/lib/prisma';


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
    const type = url.searchParams.get('type');

    if (!cafeId || !type) {
      return NextResponse.json(
        { success: false, message: 'Cafe ID and type are required' },
        { status: 400 }
      );
    }

    const limit = Number(url.searchParams.get('limit') ?? 10);
    const page = Number(url.searchParams.get('page') ?? 1);
    const offset = (page - 1) * limit;

    // --- Fetch paginated reviews ---
    const reviewsRaw = await prisma.review.findMany({
      where: { reviewableType: type as ReviewableType, reviewableId: cafeId },
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

    // --- Fetch all reviews to calculate star breakdown ---
    const allReviews = await prisma.review.findMany({
      where: { reviewableType: type as ReviewableType, reviewableId: cafeId },
      select: { rating: true },
    });

    const totalReviews = allReviews.length;

    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(r => {
      if (r.rating && r.rating >= 1 && r.rating <= 5) {
        starCounts[r.rating] += 1;
      }
    });

    const starPercentages: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      starPercentages[i] = totalReviews ? Math.round((starCounts[i] / totalReviews) * 100) : 0;
    }

    const overallScore =
      totalReviews > 0
        ? allReviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) / totalReviews
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
        starCounts,
        starPercentages,
        overallScore: parseFloat(overallScore.toFixed(1)),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch reviews',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { stars, comment, reviewableId, reviewableType } = await req.json();

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role === 'owner') {
      return NextResponse.json({ success: false, message: 'Cafe owners cannot review.' }, { status: 400 });
    }

    if (!reviewableId || !stars) {
      return NextResponse.json({ success: false, message: 'cafeId and stars are required' }, { status: 400 });
    }

    if (stars < 1 || stars > 5) {
      return NextResponse.json({ success: false, message: 'Stars must be between 1 and 5' }, { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        reviewableType,
        reviewableId,
        rating: stars,
        comment,
      },
    });

    let updatedCafe = null;

    // If reviewing a cafe, update its totalStars and reviewCount
    if (reviewableType === 'Cafe') {
      updatedCafe = await prisma.cafe.update({
        where: { id: reviewableId },
        data: {
          reviewCount: { increment: 1 },
          totalStars: { increment: stars },
        },
      });
    }

    // Calculate new average rating
    const averageRating = updatedCafe
      ? parseFloat((updatedCafe.totalStars / updatedCafe.reviewCount).toFixed(1))
      : null;

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
      updatedCafe: {
        reviewCount: updatedCafe?.reviewCount,
        totalStars: updatedCafe?.totalStars,
        averageRating,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong';
    return NextResponse.json({ success: false, message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

