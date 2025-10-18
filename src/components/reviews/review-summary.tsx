import Stars from '@/components/shared/stars';
import { Ratings } from '../../../types';

export default function ReviewsSummary({ ratings }: { ratings: Ratings }) {
  return (
    <div className="mt-[52px]">
      <h6>Reviews for the daily grind</h6>
      <div className="flex items-center my-[32px] space-x-6 border rounded-md">
        <div className="flex flex-col items-center justify-center w-[20%]">
          <p className="text-[102px] text-primary-500">{ratings.overallScore.toFixed(1)}</p>
          <Stars rate={ratings.overallScore} />
        </div>
        <div className="w-[80%] p-4">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center space-x-4 py-2 border-b last:border-none">
              <span className="text-gray-700 font-bold">{star}</span>
              <div className="w-full h-2 bg-gray-200 rounded-md">
                <div
                  className="bg-primary-500 h-full rounded-full"
                  style={{ width: `${ratings.starPercentages[star]}%` }}
                />
              </div>
              <span className="text-[14px] text-primary-600">{ratings.starPercentages[star]}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
