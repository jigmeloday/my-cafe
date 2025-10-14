'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  CafeType,
  Pagination,
  Ratings,
  ReviewsResponse,
} from '../../../../types';
import { fetchReviewList } from '@/lib/services/review/review.service';
import ReviewsSummary from '@/components/reviews/review-summary';
import ReviewList from '@/components/reviews/review-list';
import ReviewForm from '@/components/reviews/review-form';
import { useSession } from 'next-auth/react';

function OverviewTab({ cafe }: { cafe: CafeType }) {
  const { slug } = useParams();
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Fetch reviews
  const loadReviews = async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    const res = await fetchReviewList({
      limit: 10,
      page: 1,
      cafeId: slug as string,
    });
    if (res.success && res.data) {
      setLoading(false);
      setReviewsData(res.data);
    } else {
      setLoading(false);

      setError(res.message || 'Failed to fetch reviews');
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reviewsData) return null;

  return (
    <div className="flex space-x-[120px] py-[20px] px-[8px]">
      <div className="w-full">
        <h6>About us</h6>
        <p className="mt-4 text-[14px] text-justify">{cafe.description}</p>
        {/* Ratings summary */}
        <ReviewsSummary ratings={reviewsData.ratings as Ratings} />

        {/* Review list */}
        <ReviewList
          reviews={reviewsData.reviews}
          pagination={reviewsData.pagination as Pagination}
        />

        {/* Review form */}
        {session?.user.id && session.user.role !== 'owner' && (
          <ReviewForm slug={slug as string} onReviewSubmit={loadReviews} />
        )}
      </div>
    </div>
  );
}

export default OverviewTab;
