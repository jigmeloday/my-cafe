'use client';
import { useEffect, useState } from 'react';
import CafeBanner from '../cafe-banner';
import { getBanners } from '@/lib/action/banner.action';
import { BannerType } from '../../../../types';

function CreateBanner({
  theme,
  banners,
}: {
  theme: string;
  banners: BannerType[];
}) {
  const [bannersList, setBanners] = useState<BannerType[]>(banners);

  return (
    <div className="relative h-full">
      <div>

      </div>
    </div>
  );
}

export default CreateBanner;
