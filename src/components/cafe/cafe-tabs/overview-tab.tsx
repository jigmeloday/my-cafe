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
import Loader from '@/components/shared/loader';

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
      type: 'Cafe'
    });
    if (res.success && res.data) {
      setLoading(false);
      setReviewsData(res.data as ReviewsResponse);
    } else {
      setLoading(false);

      setError(res.message || 'Failed to fetch reviews');
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading) return <Loader
            className="h-screen flex items-center justify-center"
            title="Please wait while searching for menu..."
          /> ;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reviewsData) return null;

  return (
    <div className="flex space-x-[120px] p-[24px]">
      <div className="w-full">
        <h6>About us</h6>
        <p className="mt-4 text-[14px] text-justify">{cafe.description}</p>
        <ReviewsSummary ratings={reviewsData.ratings as Ratings} />

       {
        reviewsData.reviews.length ?  <ReviewList
          reviews={reviewsData.reviews}
          pagination={reviewsData.pagination as Pagination}
        /> : null
       }

        {session?.user.id && session.user.role !== 'owner' && (
          <ReviewForm slug={slug as string} onReviewSubmit={loadReviews} />
        )}
      </div>
    </div>
  );
}

export default OverviewTab;
