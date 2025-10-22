import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../auth';
import { redirect } from 'next/navigation';
import { BannerList } from '@/components/banner-listing/banner-list';
import TitleComponent from '@/components/shared/title-component';
import { getBanners } from '@/lib/action/banner.action';
import { getCafeByCafeOwner } from '@/lib/action/cafe.action';
import { CafeType } from '../../../../../types';

async function Page() {
  const session = await getServerSession(authOptions);
  const data = await getBanners();
  const cafeList = await getCafeByCafeOwner()
  if (!session?.user.id || session?.user.role !== 'owner') {
    redirect('/404');
  }

  return (
    <main className="my-[52px] px-[112px]">
     <TitleComponent title="Banner Listing" subtitle="Banner listing table" />
      <BannerList cafe={cafeList as CafeType[]} data={data} />
    </main>
  );
}

export default Page;
