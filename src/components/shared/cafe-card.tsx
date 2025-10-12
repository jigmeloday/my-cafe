'use client';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { CafeType, Role } from '../../../types';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { permissionChecker } from '@/lib/utils';
import ActionMenu from '../ui/menu-action';

export default function CafeCard(props: {
  cafe: CafeType;
  roles?: Role[];
  onAction?: (cafeId: string, type: 'close' | 'delete') => void;
  onEdit?: (cafe: CafeType) => void;
}) {
  const { cafe } = props;
  const { data: session } = useSession();
  const permission = permissionChecker(
    session?.user.role as string,
    props.roles as Role[]
  );

  return (
    <>
      <Link
        href={`cafe/${cafe.id}`}
        className="w-full rounded-md p-4 flex flex-col items-center transition-all duration-300 border-[0.5px] border-primary-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer"
      >
        <div
          onClick={(e) => {
            e.preventDefault(); // prevents Link navigation
            e.stopPropagation(); // stops event from bubbling up to Link
            console.log('Icon clicked, navigation stopped');
          }}
          className="w-full flex justify-between"
        >
          <div
            className={`${
              cafe.closed
                ? 'bg-red-200 text-red-500'
                : ' bg-green-100 text-green-800 border'
            } h-fit px-2 py-[2px] rounded-full text-[12px] flex items-center justify-center`}
          >
            {cafe.closed ? 'Closed' : 'Open'}
          </div>
          {permission && (
            <ActionMenu
              items={[
                { label: 'Edit', onClick: () => props.onEdit&& props.onEdit(cafe) },
                {
                  label: cafe.closed ? 'Open' : 'Close',
                  onClick: () =>
                    props.onAction && props.onAction(cafe.id as string, 'close'),
                },
                {
                  label: 'Delete',
                  onClick: () =>
                    props.onAction && props.onAction(cafe.id as string, 'delete'),
                },
              ]}
            />
          )}
        </div>
        <div className="relative w-[160px] h-[160px] rounded-full overflow-hidden shadow-md">
          <Image
            src={(cafe?.logo as string) || ''}
            alt="cafe-logo"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-col justify-start w-full mt-4 text-center">
          <h5 className="text-primary-800">{cafe?.name}</h5>
          <p className="text-sm text-gray-400 mt-1">
            {cafe?.subTitle
              ? `${cafe.subTitle.slice(0, 50)}${
                  cafe.subTitle.length >= 50 ? '...' : ''
                }`
              : ''}
          </p>

          <div className="flex justify-center items-center mt-2 space-x-1">
            {[1, 2, 3, 4, 5].map((item) => (
              <Star
                key={item}
                size={14}
                className="text-primary-400 fill-primary-400/80"
              />
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-2">
            {cafe.openTime} – {cafe.closeTime}
          </p>
        </div>
      </Link>
    </>
  );
}
