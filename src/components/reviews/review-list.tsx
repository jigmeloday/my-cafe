import Stars from '@/components/shared/stars';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Pagination, Review } from '../../../types';
import { getInitials } from '@/lib/utils';

export default function ReviewList({ reviews, pagination }: { reviews: Review[], pagination: Pagination }) {
  return (
    <div className="mt-[24px]">
      <h6>All reviews</h6>
      <div className="mt-[32px]">
        {reviews.map((review: Review) => (
          <div
            className="flex w-full border-t-[0.5px] border-primary-300 p-[20px] space-x-6"
            key={review.id}
          >
            <div className="w-fit">
              <div className="size-[100px] border rounded-md p-2">
                {review.user.image ? (
                  <Image
                    src={review.user.image}
                    alt="profile"
                    height={200}
                    width={300}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <span className='text-[24px] font-bold text-primary-500'> {getInitials(review.user.name as string)}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <p className="font-bold">{review.user.name || 'Anonymous'}</p>
                  <p className="text-[12px]">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <Stars rate={review.rating || 0} />
              </div>
              <p className="my-4 text-[12px]">{review.comment}</p>
            </div>
          </div>
        ))}

        {pagination.totalPages > 1 && (
          <div className="border-t-[0.5px] border-primary-300 py-[20px]">
            <Button>View More</Button>
          </div>
        )}
      </div>
    </div>
  );
}
