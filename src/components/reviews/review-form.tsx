'use client';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { sendReview } from '@/lib/services/review/review.service';
import { useSession } from 'next-auth/react';

export default function ReviewForm({
  slug,
  onReviewSubmit,
}: {
  slug: string;
  onReviewSubmit: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { data: session } = useSession();

  const submitReview = async () => {
    setSubmitting(true);
    const payload = {
      stars: rating,
      comment: comment,
      reviewableType: 'Cafe',
      reviewableId: slug,
    };
    const response = await sendReview(payload);
    if (response.success) {
      onReviewSubmit();
      setComment('');
      setRating(0);
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-[32px]">
      <h4>Write reviews</h4>
      <div className="mt-[34px]">
        <div className="flex gap-2 mb-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={22}
              onClick={() => setRating(star)}
              className={`cursor-pointer transition-transform duration-200 ${
                star <= rating
                  ? 'text-primary-500 fill-primary-500/80 scale-110'
                  : 'text-gray-300 fill-gray-300'
              }`}
            />
          ))}
        </div>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
        />
        <div className="flex w-full justify-end mt-[12px]">
          {session?.user.id && session?.user.role !== 'owner' && (
            <Button
              className="w-fit"
              disabled={submitting || rating === 0 || comment.trim() === ''}
              onClick={submitReview}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
