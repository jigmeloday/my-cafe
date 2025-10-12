import { getServerSession } from 'next-auth';
import { getCafeByCafeOwner } from '@/lib/action/cafe.action';
import CreateCafe from '@/components/cafe/cafe-owner/create-cafe';
import { authOptions } from '../../../../../../auth';
import { redirect } from 'next/navigation';
import { fetchRole } from '@/lib/action/get-role.action';

async function Page() {
  const session = await getServerSession(authOptions);
  if(session?.user.role !== 'owner' && session?.user.role !== 'super_admin') {
    redirect('/404')
  }

  const cafeListRaw = await getCafeByCafeOwner(session?.user.id as string);
  const cafeList = cafeListRaw.map(cafe => ({
    ...cafe,
    logo: cafe.logo ?? '',
  }));
  const roles = await fetchRole();
  return (
   <CreateCafe cafe={cafeList} roles={roles}/>
  )
}

export default Page;
