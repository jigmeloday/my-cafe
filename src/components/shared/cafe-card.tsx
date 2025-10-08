import Image from "next/image";
import { Star } from "lucide-react";

export default function CafeCard() {
  return (
    <div className="w-full rounded-md p-4 flex flex-col items-center transition-all duration-300 border-[0.5px] border-primary-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer">
      <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden shadow-md">
        <Image
          src="/banner/logo1.png"
          alt="cafe-logo"
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col justify-start w-full mt-4 text-center">
        <h4 className="text-primary-500">
          Starbuck
        </h4>
        <p className="text-sm text-gray-400 mt-1">Freshly brewed coffee daily</p>

        <div className="flex justify-center items-center mt-2 space-x-1">
          {[1, 2, 3, 4, 5].map((item) => (
            <Star
              key={item}
              size={14}
              className="text-yellow-400 fill-yellow-400/80"
            />
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-2">Open: 7:00 AM – 10:00 PM</p>
      </div>
    </div>
  );
}
