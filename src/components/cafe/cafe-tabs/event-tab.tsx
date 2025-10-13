import Image from 'next/image';
import { useState } from 'react';

function EventTabs() {
  const [active, setActive] = useState(1);
  return (
    <div className="flex px-[4px] py-[20px] space-x-7">
      <div className="space-y-[24px] w-[70%]">
        <div className="flex space-x-[20px]">
          <div className="flex items-center">
            <div className="flex flex-col items-center px-[12px]">
              <p className="text-[18px] font-bold text-primary-500">20</p>
              <p className="text-primary-500"> Wed</p>
            </div>
            <div className="flex flex-col items-center space-y-[10px] h-full">
              <div
                className={` size-[12px] rounded-full shadow-[0_0_3px_rgba(0,0,0,0.7)] transform -translate-y-1 scale-110 transition-all duration-300 ${
                  active === 1 ? 'bg-primary-600 ' : 'bg-gray-200'
                }`}
              />
              <div className="w-[3px] flex-1 bg-gray-200 rounded-full" />
            </div>
          </div>

          <div
            className={`flex w-full border rounded-md p-[20px] space-x-[24px] ${
              active === 1 ? 'bg-[#F9EAF3] cursor-pointer' : ''
            }`}
          >
            <div className="size-[100px] rounded-md border overflow-hidden">
              <Image
                src="/banner/dummy/globe.jpg"
                alt=""
                height={200}
                width={200}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="space-y-[12px]">
              <p className="font-bold text-[18px]">Title</p>
              <div>
                <p className="text-[14px]">Title</p>
                <p className="text-[14px]">Title</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-[20px]">
          <div className="flex items-center">
            <div className="flex flex-col items-center px-[12px]">
              <p className="text-[18px] font-bold text-primary-500">20</p>
              <p className="text-primary-500"> Wed</p>
            </div>
            <div className="flex flex-col items-center space-y-[10px] h-full">
              <div
                className={` size-[12px] rounded-full shadow-[0_0_3px_rgba(0,0,0,0.7)] transform -translate-y-1 scale-110 transition-all duration-300 ${
                  active === 2 ? 'bg-primary-700 ' : 'bg-gray-300'
                }`}
              />
              <div className="w-[3px] flex-1 bg-gray-200 rounded-full" />
            </div>
          </div>

          <div
            className={`flex w-full border rounded-md p-[20px] space-x-[24px] ${
              active === 2 ? 'bg-primary-50 cursor-pointer' : ''
            }`}
          >
            <div className="size-[100px] rounded-md border">
              <Image
                src="/banner/dummy/globe.jpg"
                alt=""
                height={200}
                width={200}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="space-y-[12px]">
              <p className="font-bold text-[18px]">Title</p>
              <div>
                <p className="text-[14px]">Title</p>
                <p className="text-[14px]">Title</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[350px] w-[30%] border rounded-md overflow-hidden">
        <div className="h-[64%] ">
          <Image
            src="/banner/dummy/globe.jpg"
            alt="cover pic"
            height={600}
            width={600}
            className="object-cover h-full w-full"
          />
        </div>
        <div className="space-y-[12px] px-[16px] py-[24px]">
          <p className="font-bold text-[18px]">Title</p>
          <div>
            <p className="text-[14px]">Title</p>
            <p className="text-[14px]">Title</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventTabs;
