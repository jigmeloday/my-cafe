'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MenuType } from '../../../types';
import Stars from './stars';
import { FaPepperHot } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import ActionMenu from '../ui/menu-action';
import { cloudinaryLoader } from '@/lib/utils';

function MenuCard({
  menu,
  onAction,
  onEdit,
}: {
  menu: MenuType;
  onAction?: (cafeId: string, type: 'close' | 'delete') => void;
  onEdit?: (menu: MenuType) => void;
}) {
  const { data: session } = useSession();

  return (
    <Link
      href={`/menu-details/${menu.id}`}
      className="w-full shadow rounded-md overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer transition duration-500 ease-in-out"
    >
      {/* Menu Image */}
      <div className="h-[250px] w-full relative">
        <Image
        loader={cloudinaryLoader}
          src={menu?.Images?.[0]?.url || '/banner/dummy/globe.jpg'}
          alt={menu.name}
          height={500}
          width={500}
          className="object-cover h-full w-full"
        />

        {/* Discount badge */}
        {!menu.isAvailable ? (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-md">
            Unavailable
          </span>
        ) : menu.discount && menu.discount > 0 ? (
          <span className="absolute top-2 left-2 bg-primary-500 text-white text-xs px-2 py-1 rounded-md">
            -{menu.discount}%
          </span>
        ) : null}
        {menu.archived ? (
          <div className="absolute font-bold w-full bg-primary-50/30 px-[16px] text-primary-500 bottom-0">
            Archived
          </div>
        ) : null}
        <div
          onClick={(e) => {
            e.preventDefault(); // prevents Link navigation
            e.stopPropagation(); // stops event from bubbling up to Link
          }}
          className="absolute right-2 top-2"
        >
          {session?.user.role === 'owner' && (
            <ActionMenu
              items={[
                {
                  label: 'Edit',
                  onClick: () => onEdit && onEdit(menu),
                },
                {
                  label: !menu.isAvailable ? 'Available' : 'Not Available',
                  onClick: () =>
                    onAction && onAction(menu.id as string, 'close'),
                },
                {
                  label: 'Delete',
                  onClick: () =>
                    onAction && onAction(menu.id as string, 'delete'),
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Menu Info */}
      <div className="py-4 px-3">
        {/* Price + rating + prep time */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-2 items-center">
            <p
              className={`  ${
                menu.discount
                  ? `line-through text-black/40 text-[12px]`
                  : 'text-primary-500 font-bold'
              }`}
            >
              ${menu?.price?.toFixed(2)}
            </p>
            {menu.discount ? (
              <p className="font-bold text-red-500">
                ${menu?.price ? (menu?.price * (1 - menu.discount / 100)).toFixed(2) : 0}
              </p>
            ) : null}
          </div>
          <div className="flex items-center space-x-2">
            <Stars rate={menu?.totalStars || 0} />
            {menu.prepTime && (
              <span className="text-xs text-black/50">{menu.prepTime} min</span>
            )}
          </div>
        </div>

        {/* Name and cafe */}
        <h6 className="font-semibold text-black/90">{menu.name}</h6>
        {menu.cafe?.name && (
          <p className="mt-1 text-black/50 text-sm">{menu.cafe.name}</p>
        )}
        {menu.spicyRate && menu.spicyRate > 0 ? (
          <div className="flex items-center mt-2 space-x-1">
            {Array.from({ length: menu.spicyRate }).map((_, i) => (
              <FaPepperHot size={12} className="text-black/50" key={i} />
            ))}
          </div>
        ) : null}
        {/* Ingredients */}
        {menu.ingredients?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {menu.ingredients.slice(0, 3).map((item, index) => (
              <span
                key={item + index}
                className="px-2 py-1 border border-primary-200 rounded-md text-xs bg-white/10"
              >
                {item.trim().charAt(0).toUpperCase() + item.trim().slice(1)}
              </span>
            ))}
            {menu.ingredients.length > 3 && (
              <span className="text-[12px] text-black/40">
                +{menu.ingredients.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default MenuCard;
