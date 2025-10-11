import { Coffee } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#FFF2F2] via-[#FFE6E6] to-[#FFD9D9]">

      
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Brewing your coffee...
      </h1>
      <p className="text-gray-600 mb-4">
        ☕ Please wait while we make your coffee perfect!
      </p>
      

      {/* Dots */}
      <div className="flex space-x-2 mt-2">
        <span className="w-3 h-3 rounded-full bg-primary-500 animate-bounce" />
        <span className="w-3 h-3 rounded-full bg-primary-500 animate-bounce delay-150" />
        <span className="w-3 h-3 rounded-full bg-primary-500 animate-bounce delay-300" />
      </div>
    </div>
  );
}
