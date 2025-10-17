'use client';
import { useState } from 'react';
import MenuTab from './menu-tabs';
import OverviewTab from './overview-tab';
import EventTabs from './event-tab';
import { Map, MapPin, Phone, Timer } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLink, FaTiktok } from 'react-icons/fa';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CAFE_TABS } from '@/lib/constant';
import { CafeType } from '../../../../types';
import { timeFormatter } from '@/lib/utils';
import Image from 'next/image';
import Stars from '@/components/shared/stars';

function CafeTab({ cafe }: { cafe: CafeType }) {
  const [active, setActive] = useState(2);

  return (
    <div className="py-4 w-full">
      <div className="flex w-full border rounded-md space-x-4 px-4 py-2  bg-gray-200 sticky top-[90px] z-10">
        {CAFE_TABS.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => {
              if (cafe.isActive) setActive(id);
            }}
            className={`${
              active === id
                ? 'bg-white shadow text-primary-500'
                : 'hover:bg-gray-300'
            } w-full  rounded-full py-3 text-center cursor-pointer font-bold transition-all duration-300 ease-in-out`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className="flex space-x-6 min-h-[80%]">
        {cafe.isActive ? (
          <div className="w-[80%] mt-[32px] border rounded-md">
            {active === 1 ? (
              <MenuTab />
            ) : active === 2 ? (
              <OverviewTab cafe={cafe} />
            ) : (
              <EventTabs />
            )}
          </div>
        ) : (
          <div className="w-[80%] flex flex-col items-center justify-center h-full text-center p-8 ">
            <div className="size-[220px] animate-fade-in-up mb-6">
              <Image
                src="/svg/cheer.svg"
                alt="Cafe Opening Celebration"
                width={300}
                height={300}
                className="h-full w-full object-contain drop-shadow-xl"
              />
            </div>

            <div className="space-y-3 max-w-[500px]">
              <h6 className="text-primary-500/80">
                ☕ Cheers to a fresh beginning!
              </h6>
              <p className="text-[14px] text-black/60">
                Your cafe has officially entered our review queue — the aroma of success is already brewing. 🌿
              </p>
              <p className="text-primary-500 text-[12px] italic">
                Sit back and relax — your grand opening is just around the corner. ✨
              </p>
            </div>
          </div>
        )}
        <div className="mt-[32px] border p-[20px] rounded-md h-fit sticky top-[160px]">
          <h6>More details</h6>
          <div className="mt-[20px] space-y-[8px]">
            <div className="flex items-center space-x-2">
              <Timer size={16} />
              <p className="text-[14px]">
                {timeFormatter(cafe?.openTime as string)} -{' '}
                {timeFormatter(cafe?.closeTime)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              {cafe?.address ? (
                <span className="text-[14px]">Babesa, Thimphu</span>
              ) : (
                <span className="text-[14px]">Address not found</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Map size={16} />
              {cafe.googleMap ? (
                <Link
                  href={cafe.googleMap}
                  className="text-[14px] text-primary-500 hover:text-primary-800 ease-in-out transition duration-300"
                >
                  Google Map
                </Link>
              ) : (
                <span className="text-[14px]">No google map link</span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              {cafe.phone ? (
                <Link
                  type="tel"
                  href="/"
                  className="text-[14px] text-primary-500 hover:text-primary-800 ease-in-out transition duration-300"
                >
                  +975-77455740
                </Link>
              ) : (
                <span className="text-[14px]">No google map link</span>
              )}
            </div>
          </div>
          <div className='mt-[20px]'>
            <Stars rate={cafe?.totalStars || 0} />

          </div>
          <div className="mt-[28px]">
            <h6>Follow Us</h6>
            <div className="flex mt-[20px] space-x-[8px]">
              {cafe.socialLinks ? (
                <>
                  {cafe.socialLinks.facebook && (
                    <Link target="_blank" href={cafe.socialLinks.facebook}>
                      <FaFacebook
                        size={20}
                        className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
                      />
                    </Link>
                  )}
                  {cafe.socialLinks.instagram && (
                    <Link target="_blank" href={cafe.socialLinks.instagram}>
                      <FaInstagram
                        size={20}
                        className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
                      />
                    </Link>
                  )}
                  {cafe.socialLinks.tiktok && (
                    <Link target="_blank" href={cafe.socialLinks.tiktok}>
                      <FaTiktok
                        size={20}
                        className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
                      />
                    </Link>
                  )}
                </>
              ) : (
                <span className="text-[14px]">No social link</span>
              )}
              {cafe.website && (
                <Link target="_blank" href={cafe.website}>
                  <FaLink
                    size={20}
                    className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
                  />
                </Link>
              )}
            </div>
          </div>
          <div className="mt-[30px] space-y-[8px] w-full">
            <Button>Download QR</Button>
            <Button variant="outline">Share</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CafeTab;
