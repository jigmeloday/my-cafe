'use client';
import { useState } from 'react';
import { CafeType } from '../../../types';
import CafeCard from '../shared/cafe-card';
import { Button } from '../ui/button';

function CafeListing({ cafe, limit, page }: { cafe: CafeType[], limit:number, page:number }) {
  const offset = (page - 1) * limit;
  const [cafeList, setCafeList] = useState(cafe);

  return (
    <div className='w-full'>
      <div className="grid grid-cols-5 gap-4 my-[52px]">
        {cafeList?.map((item) => (
          <CafeCard key={item.id} cafe={item} />
        ))}
      </div>
      <div className="my-6 w-full flex items-center justify-center">
       <Button variant="outline">Load More</Button>
      </div>
    </div>
  );
}

export default CafeListing;
