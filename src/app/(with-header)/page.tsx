import LandingBanner from '@/components/landing/landing-banner';
import TitleComponent from '@/components/shared/title-component';

export default function Home() {
  return (
    <main>
      <section className="flex lg:h-[56vh] mt-[12px]">
        <LandingBanner />
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
       <TitleComponent title="Top Rated Cafe" />
       <div className='flex justify-between my-[24px] space-x-10'>
        {
          [1,2,3,4].map((item) => (
            <div key={item} className='border w-full '>hello</div>
          ))
        }
       </div>
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">Feature</section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        top-rated foods
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        blog listing{' '}
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        newsletter email/think sth
      </section>
    </main>
  );
}
