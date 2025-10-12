import BlogList from '@/components/landing/blog-list';
import FeatureList from '@/components/landing/feature-list';
import LandingBanner from '@/components/landing/landing-banner';
import CafeCard from '@/components/shared/cafe-card';
import EventCard from '@/components/shared/event-cards';
import MenuCard from '@/components/shared/menu-card';
import Newsletter from '@/components/shared/newsletter';
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
        <TitleComponent
          title="Top Rated Cafe"
          subtitle="Explore cafés that our users rated the highest."
        />
        <div className="flex justify-between my-[24px] space-x-10">
          {cafe.map((item) => (
            <div key={item.id} className="w-full my-[24px]">
              <CafeCard cafe={item} />
            </div>
          ))}
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent
          title="Top Rated"
          subtitle="See which cafés are winning hearts in our community."
        />
        <div className="grid grid-cols-4 gap-4 my-[24px]">
          {menu.map((item) => (
            <MenuCard key={item.id} menu={item} />
          ))}
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent
          title="Featured Cafe"
          subtitle="Discover cafés we’ve specially selected for you."
        />
        <div className="my-[24px]">
          <FeatureList feature={feature} />
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent
          title="Our Blogs"
          subtitle="Stay inspired with stories from our café community."
        />
        <div className="my-[32px]">
          <BlogList />
        </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        <TitleComponent
          title="Upcoming Events"
          subtitle="Stay updated on our latest events and experiences."
        />
        <div className="grid grid-cols-4 my-[32px]">
          <EventCard />
        </div>
      </section>
      <section className="py-[120px] bg-primary-50 px-[16px] lg:px-[112px]">
        <div className=" py-[96px]">
          <div className="mx-auto max-w-2xl text-center">
            <h4>
              Your café journey starts here — stay inspired with the latest
              updates.
            </h4>
            <Newsletter />
            <p className="text-black/45 mt-3">
              Join our community and get exclusive café stories, reviews, and
              giveaways delivered straight to your inbox.
            </p>
            <p className="text-sm text-black/70 mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
