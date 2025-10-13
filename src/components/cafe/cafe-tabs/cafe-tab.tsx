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

function CafeTab() {
  const [active, setActive] = useState(2);
  return (
    <div className="py-4 w-full">
      <div className="flex w-full border rounded-md space-x-4 px-4 py-2  bg-gray-200 sticky top-[90px] z-10">
        {CAFE_TABS.map(({ id, label }) => (
          <div
            key={id}
            onClick={() => setActive(id)}
            className={`${
              active === id ? 'bg-white shadow text-primary-500' : 'hover:bg-gray-300'
            } w-full  rounded-full py-3 text-center cursor-pointer font-bold transition-all duration-300 ease-in-out`}
          >
           {label}
          </div>
        ))}
      </div>
      <div className="flex space-x-6">
        <div className="w-[80%] mt-[32px] border rounded-md p-[20px]">
          {active === 1 ? (
            <MenuTab />
          ) : active === 2 ? (
            <OverviewTab />
          ) : (
            <EventTabs />
          )}
        </div>
        <div className="mt-[32px] border p-[20px] rounded-md h-fit sticky top-[160px]">
          <h6>More details</h6>
          <div className="mt-[20px] space-y-[8px]">
            <div className="flex items-center space-x-2">
              <Timer size={16} />
              <p className="text-[14px]">7:00 AM - 12:00 AM</p>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin size={16} />
              <p className="text-[14px]">Babesa Thimphu Bhutan</p>
            </div>
            <div className="flex items-center space-x-2">
              <Map size={16} />
              <Link
                href="/"
                className="text-[14px] text-primary-500 hover:text-primary-800 ease-in-out transition duration-300"
              >
                Google Map
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} />
              <Link
                type="tel"
                href="/"
                className="text-[14px] text-primary-500 hover:text-primary-800 ease-in-out transition duration-300"
              >
                +975-77455740
              </Link>
            </div>
          </div>

          <div className="mt-[28px]">
            <h6>Follow Us</h6>
            <div className="flex mt-[20px] space-x-[8px]">
              <FaFacebook
                size={20}
                className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
              />
              <FaInstagram
                size={20}
                className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
              />
              <FaTiktok
                size={20}
                className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
              />
              <FaLink
                size={20}
                className="cursor-pointer text-primary-500 hover:text-primary-600 hover:scale-110 transition duration-500 ease-in-out"
              />
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
