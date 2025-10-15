import CafeBanner from '@/components/cafe/cafe-banner';
import CafeTab from '@/components/cafe/cafe-tabs/cafe-tab';
import { getBanners } from '@/lib/action/banner.action';
import { timeFormatter } from '@/lib/utils';
import { MapPin, Phone, Timer } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CafeType } from '../../../../../../types';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../../auth';
import { getCafeDetails } from '@/lib/services/cafe/cafe-service';

async function Page(props: { params: Promise<{ slug: string }> }) {
  const { params } = props;
  const session = await getServerSession(authOptions);
  const banners = await getBanners((await params)?.slug as string);
  const { data:cafeDtails } = await getCafeDetails(
    (
      await params
    )?.slug as string
  );
  
  if(!cafeDtails) {
    redirect('/not-found')
  }

  return (
    <main className="px-[16px] lg:px-[112px]">
      <section className="relative w-full mt-2 pb-[24px]">
        <div className="relative">
          <div className="w-full h-[340px] rounded-md overflow-hidden relative">
            {banners.length ? (
              <CafeBanner banners={banners} />
            ) : (
              <div
                className="h-full w-full flex flex-col items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${cafeDtails?.themeColor}, #d9d9d9)`,
                }}
              >
                <div className="flex flex-col items-center justify-end pb-3">
                  <h3
                    className="drop-shadow-[0_0_10px_rgba(100,255,218,0.8)]
          transition-transform duration-500 ease-in-out hover:scale-105"
                  >
                    {cafeDtails?.name}
                  </h3>
                  <Link
                    href="#"
                    className="mt-2 inline-block py-2 px-4 text-sm uppercase bg-primary-500 text-white rounded-md shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 w-fit"
                  >
                    Create Banner
                  </Link>
                </div>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0">
              <div className="flex flex-wrap justify-end items-center gap-6 border px-4 py-2 bg-white text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary-300" />
                  {cafeDtails?.address ? (
                    <span>Babesa, Thimphu</span>
                  ) : (
                    <span>Address not found</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-300" />
                  {cafeDtails?.phone ? (
                    <span>{cafeDtails?.phone}</span>
                  ) : (
                    <span>No phone number</span>
                  )}
                </div>
                <div
                  className={` w-fit px-2 rounded-full text-white text-[12px] ${
                    cafeDtails?.closed ? 'bg-red-400' : 'bg-green-400'
                  }`}
                >
                  {cafeDtails?.closed ? 'Closed' : 'Open'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-4 size-[120px] rounded-md shadow-lg overflow-hidden bg-white p-2">
          <Image
            src={(cafeDtails?.logo as string) || '/banner/logo1.png'}
            alt="profile image"
            height={120}
            width={120}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mt-2 px-2 ml-[140px]">
          <h6>{cafeDtails?.name}</h6>
          <div className="flex items-center space-x-2 mt-2">
            <Timer size={16} />
            <p className="text-[12px] text-black/60">
              {timeFormatter(cafeDtails?.openTime as string)} -{' '}
              {timeFormatter(cafeDtails?.closeTime as string)}
            </p>
          </div>
        </div>
      </section>

      <section className="flex my-[42px]">
        <CafeTab cafe={cafeDtails as CafeType} />
      </section>
    </main>
  );
}

export default Page;
