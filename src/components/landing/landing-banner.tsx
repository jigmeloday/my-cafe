'use client';
import Link from 'next/link';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { BannerType } from '../../../types';

export default function LandingBanner({ banners }: { banners: BannerType[] }) {
  return (
    <Swiper
      modules={[Pagination, Autoplay, EffectFade]}
      effect="fade"
      fadeEffect={{ crossFade: true }}
      spaceBetween={10}
      speed={1500}
      loop={true}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      slidesPerView={1}
      className="w-full h-full"
    >
      {banners?.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            className="relative w-full h-full flex items-center justify-start px-[112px] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(211, 47, 125, 0.7), rgba(255, 180, 200, 0.2)), url(${slide.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Text Content Animation */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-4 max-w-lg text-white"
            >
              <h4 className="text-white">{slide.cafe.name}</h4>
              <h1 className="text-black/70">{slide.title}</h1>
              <p className="text-sm font-light">{slide.subtitle}</p>
              <div className="mt-6">
                <Link
                  href={slide.link}
                  className="inline-block py-3 px-6 font-extrabold uppercase bg-primary-500 text-white rounded-md shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  {slide.buttonText}
                </Link>
              </div>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
