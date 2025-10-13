'use client';
import Stars from '@/components/shared/stars';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function OverviewTab() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex space-x-[120px]">
      <div className="py-[20px] px-[8px]">
        <h6>About us</h6>
        <p className="mt-4 text-[14px] text-justify">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        <div className="mt-[52px]">
          <h6>Reviews for the daily grind</h6>
          <div className="flex items-center my-[32px] space-x-6 border rounded-md">
            <div className="flex flex-col items-center justify-center w-[20%]">
              <p className="text-[102px] text-primary-400">4.5</p>
              <Stars rate={4} />
            </div>
            <div className="w-[80%] p-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div
                  key={rating}
                  className="flex items-center space-x-4 py-2 border-b last:border-none"
                >
                  <span className="text-gray-700 font-bold">{rating}</span>
                  <div className="w-full h-2 bg-gray-200 rounded-md">
                    <div className="w-[40%] bg-primary-400 rounded-full h-full" />
                  </div>
                  <span className="text-[14px] text-primary-600">50%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[24px]">
            <h6>All reviews</h6>
            <div className="mt-[32px]">
              {[1, 2, 3, 4].map((item) => (
                <div
                  className="flex w-full border-t-[0.5px] border-primary-300 p-[20px] space-x-6"
                  key={item}
                >
                  <div className="w-fit">
                    <div className="size-[100px] border rounded-md p-2">
                      <Image
                        src="/banner/logo1.png"
                        alt="profile"
                        height={200}
                        width={300}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="space-y-1">
                        <p className="font-bold">Jigme Lodey</p>
                        <p className="text-[12px]">20 Oct 2025</p>
                      </div>
                      <Stars rate={4.5} />
                    </div>
                    <p className="my-4 text-[12px]">
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry. Lorem Ipsum has been the
                      industry&apos;s standard dummy text ever since the 1500s,
                      when an unknown printer took a galley of type and
                      scrambled it to make a type specimen book. It has survived
                      not only five centuries, but also the leap into electronic
                      typesetting,
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t-[0.5px] border-primary-300 py-[20px]">
                <Button>View More</Button>
              </div>
            </div>
          </div>
          <div className="mt-[32px]">
            <h4>Write reviews</h4>
            <div className="mt-[34px]">
              <div className="flex gap-2 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setRating(star)}
                    className={`cursor-pointer transition-transform duration-200 ${
                      star <= (hover ?? rating)
                        ? 'text-primary-400 fill-primary-400/80 scale-110'
                        : 'text-gray-300 fill-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div>
                <Textarea />
                <div className="flex w-full justify-end mt-[12px]">
                  <Button className="w-fit">Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
