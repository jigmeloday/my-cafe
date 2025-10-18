'use client';
import Link from 'next/link';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { BannerType } from '../../../types';

export default function CafeBanner({ banners }: { banners: BannerType[] }) {
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
            className="relative w-full h-full flex items-center justify-start px-[24px] overflow-hidden"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(255, 90, 90, 0.7), rgba(255, 126, 126, 0.2)), url(${slide.imageUrl})`,
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
              className="space-y-3 max-w-sm text-white"
            >
              <h6 className="text-white">{slide.cafe.name}</h6>
              <h3 className="text-black/70">{slide.title}</h3>
              <p className="text-[12px] font-light">{slide.subtitle}</p>
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
