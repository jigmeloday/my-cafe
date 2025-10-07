import LandingBanner from '@/components/landing/landing-banner';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <section className="flex lg:h-[56vh] mt-[12px]">
        <LandingBanner />
      </section>
      <section className="my-[120px] px-[16px] lg:px-[112px]">
        Top Rate Cafe
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
