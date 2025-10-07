'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const banners = [
  {
    id: 1,
    cafeName: 'Starbuck',
    image: '/banner/logo1.png',
    title: 'Grand Opening!',
    subtitle: 'Visit our new cafe in town and enjoy freshly brewed coffee.',
    buttonText: 'Visit Now',
    link: '/menu',
    titleColor: 'text-[#197355]',
    bg: 'linear-gradient(135deg, #6DD3B1 0%, #3FB68F 100%)',
  },
  {
  id: 2,
  cafeName: 'Renberio',
  image: '/banner/logo2.png',
  title: '20% OFF Today!',
  subtitle: 'Get 20% off on every order. Treat yourself!',
  buttonText: 'Order Now',
  link: '/order',
  titleColor: 'text-[#80775e]',
  bg: 'linear-gradient(135deg, #E8D69F 0%, #CDAF7A 100%)', // new gradient using the same palette
},
  {
    id: 3,
    cafeName: 'Coopers',
    image: '/banner/logo3.png',
    title: 'New Seasonal Drinks',
    subtitle: 'Try our special autumn menu with cozy flavors.',
    buttonText: 'Explore Menu',
    link: '/menu',
    titleColor: 'text-[#A15A2C]',
    bg: 'linear-gradient(135deg, #E3B889 0%, #C67C4B 100%)',
  },
];

export default function LandingBanner() {
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
      {banners.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            style={{ background: slide.bg }}
            className="flex w-full h-full justify-between items-center px-[112px]"
          >
            {/* Text Content Animation */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="space-y-4"
            >
              <h4 className={slide.titleColor}>{slide.cafeName}</h4>
              <h1 className={slide.titleColor}>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <div className="mt-[40px]">
                <Link
                  className="inline-block py-3 px-4 font-bold bg-primary-400 text-white shadow-xl rounded-md hover:scale-110 transition-transform duration-300 ease-in-out"
                  href={slide.link}
                >
                  {slide.buttonText}
                </Link>
              </div>
            </motion.div>

            {/* Image Animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="flex items-center justify-center w-fit shadow-2xl p-[20px] rounded-full"
            >
              <Image
                src={slide.image}
                alt="slider logo"
                height={500}
                width={500}
                className="size-[250px] object-cover rounded-full"
              />
            </motion.div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
