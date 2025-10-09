import Link from 'next/link';
import { MenuType } from '../../../types';
import Image from 'next/image';
import { Star } from 'lucide-react';

function MenuCard({ menu }: { menu: MenuType }) {

  return (
    <Link href={`/menu-details/${menu.id}`} className="w-full shadow rounded-md overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer transition duration-500 ease-in-out">
      <div className="h-[250px] ">
        <Image
          src={'/banner/dummy/globe.jpg'}
          alt=""
          height={500}
          width={500}
          className="object-cover object-center h-full w-full"
        />
      </div>
      <div className="py-[16px] px-2">
       <div className='flex justify-between items-center'>
         <p className="font-bold">$ {menu.price}</p>
        <div className='flex space-x-1'>
          {[1, 2, 3, 4, 5].map((item) => (
            <Star
              key={item}
              size={14}
              className="text-primary-500 fill-primary-400/80"
            />
          ))}
         </div>
       </div>
        <h6>{menu.name}</h6>
        <p className='mt-[4px] text-black/50 text-[14px]'>{menu.cafe.name}</p>
        <div className='flex flex-wrap gap-2 my-[12px]'>
          {menu.ingredients?.map((item, index) => (
            <div key={item + index} className='px-[8px] py-[1px] border border-primary-200 rounded-md text-[12px]'>
              {item.trim().charAt(0).toUpperCase() + item.trim().slice(1)}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default MenuCard;
