import LandingBanner from '@/components/landing/landing-banner';
import CafeCard from '@/components/shared/cafe-card';
import MenuCard from '@/components/shared/menu-card';
import TitleComponent from '@/components/shared/title-component';
import { CafeList, MenuList } from '@/lib/action/cafe.action';

export default async function Home() {
  const cafeList = await CafeList({ limit: 4 });
  const menuList = await MenuList({ limit: 4 });

  return (
    <main>
      <section className="flex lg:h-[56vh] mt-[12px]">
        <LandingBanner />
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent title="Top Rated Cafe" />
        <div className="flex justify-between my-[24px] space-x-10">
          {cafeList.map((item) => (
            <div key={item.id} className="w-full my-[24px]">
              <CafeCard cafe={item} />
            </div>
          ))}
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
         <TitleComponent title="Top Rated" />
        <div className="grid grid-cols-4 gap-4 my-[24px]">
          {menuList.map((item) => (
            <MenuCard key={item.id} menu={item} />
          ))}
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">Feature</section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        blog listing{' '}
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        newsletter email/think sth
      </section>
    </main>
  );
}
