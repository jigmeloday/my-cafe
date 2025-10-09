import BlogList from '@/components/landing/blog-list';
import FeatureList from '@/components/landing/feature-list';
import LandingBanner from '@/components/landing/landing-banner';
import CafeCard from '@/components/shared/cafe-card';
import MenuCard from '@/components/shared/menu-card';
import TitleComponent from '@/components/shared/title-component';
import { getBanners } from '@/lib/action/banner.action';
import { cafeList, getFeature, menuList } from '@/lib/action/cafe.action';

export default async function Home() {
  const cafe = await cafeList({ limit: 4 });
  const menu = await menuList({ limit: 4 });
  const banners = await getBanners();
  const feature = await getFeature();
  return (
    <main>
      <section className="flex lg:h-[80vh] mt-[12px]">
        <LandingBanner banners={banners} />
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent title="Top Rated Cafe" />
        <div className="flex justify-between my-[24px] space-x-10">
          {cafe.map((item) => (
            <div key={item.id} className="w-full my-[24px]">
              <CafeCard cafe={item} />
            </div>
          ))}
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
         <TitleComponent title="Top Rated" />
        <div className="grid grid-cols-4 gap-4 my-[24px]">
          {menu.map((item) => (
            <MenuCard key={item.id} menu={item} />
          ))}
        </div>
      </section>
       <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent title="Featured Cafe" />
       <div className='my-[24px]'>
         <FeatureList feature={feature} />
       </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
       <TitleComponent title="Our Blogs" />
        <div className='my-[32px]'>
          <BlogList />
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        newsletter email/think sth
      </section>
    </main>
  );
}
