import Image from "next/image";
import { Star } from "lucide-react";
import { CafeType } from '../../../types';

export default function CafeCard(props:{  cafe: CafeType } ) {
  const { cafe } = props;

  return (
    <div className="w-full rounded-md p-4 flex flex-col items-center transition-all duration-300 border-[0.5px] border-primary-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer">
      <div
      className="relative w-[160px] h-[160px] rounded-full overflow-hidden shadow-md">
        <Image
          src={cafe?.logo || ''}
          alt="cafe-logo"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-start w-full mt-4 text-center">
        <h4 className="text-primary-800">
          {cafe?.name}
        </h4>
        <p className="text-sm text-gray-400 mt-1">{cafe?.subTitle}</p>

        <div className="flex justify-center items-center mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <Star
              key={item}
              size={14}
              className="text-yellow-400 fill-yellow-400/80"
            />
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-2">{cafe.openTime} – {cafe.closeTime}</p>
      </div>
    </div>
  );
}
