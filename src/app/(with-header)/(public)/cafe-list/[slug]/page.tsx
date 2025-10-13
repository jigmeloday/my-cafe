import CafeBanner from '@/components/cafe/cafe-banner';
import CreateBanner from '@/components/cafe/cafe-owner/create-banner';
import CafeTab from '@/components/cafe/cafe-tabs/cafe-tab';
import { getBanners } from '@/lib/action/banner.action';
import { MapPin, Phone, Pin, Timer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

async function Page() {
  // const banners = await getBanners();
  return (
    <main className="px-[16px] lg:px-[112px]">
      <section className="relative w-full mt-2 pb-[24px]">
        <div className="relative">
          <div className="w-full h-[340px] rounded-md overflow-hidden relative">
            <div
              className="h-full w-full flex flex-col items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #1a73e8, #3a8ef6)',
              }}
            >
              {/* Starbucks name + Create Banner button (untouched) */}
              <div className="flex flex-col justify-end pb-3">
                <h3
                  className="drop-shadow-[0_0_10px_rgba(100,255,218,0.8)]
          transition-transform duration-500 ease-in-out hover:scale-105"
                >
                  Starbucks
                </h3>
                <Link
                  href="#"
                  className="mt-2 inline-block py-2 px-4 text-sm uppercase bg-primary-400 text-white rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-fit"
                >
                  Create Banner
                </Link>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <div className="flex flex-wrap justify-end items-center gap-6 border px-4 py-2 bg-white text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-300" />
                  <span>Babesa, Thimphu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-300" />
                  <span>+975-77455740</span>
                </div>
                <div className="bg-green-400 w-fit px-2 rounded-full text-white text-[12px]">
                  Open
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-4 size-[120px] rounded-md shadow-lg overflow-hidden bg-white p-2">
          <Image
            src="/banner/logo1.png"
            alt="profile image"
            height={120}
            width={120}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-2 px-2 ml-[140px]">
          <h6>Starbucks</h6>
          <div className="flex items-center space-x-2 mt-2">
            <Timer size={16} />
            <p className="text-[12px] text-black/60">7:00 AM - 8:00 PM</p>
          </div>
        </div>
      </section>

      <section className="flex my-[42px]">
       <CafeTab />
      </section>
    </main>
  );
}

export default Page;
