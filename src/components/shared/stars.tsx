import { Star } from 'lucide-react';

function Stars({ rate }: { rate: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((item) => {
        const full = item <= Math.floor(rate);
        const half = !full && item - rate < 1 && item - rate > 0;

        return (
          <div key={item} className="relative w-4 h-4">
            {/* Base (gray) star */}
            <Star
              size={16}
              className="absolute top-0 left-0 text-gray-300 fill-gray-300"
            />

            {/* Filled or half-filled star */}
            {full && (
              <Star
                size={16}
                className="absolute top-0 left-0 text-primary-500 fill-primary-500/80"
              />
            )}

            {half && (
              <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                <Star
                  size={16}
                  className="text-primary-500 fill-primary-500/80"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Stars;
