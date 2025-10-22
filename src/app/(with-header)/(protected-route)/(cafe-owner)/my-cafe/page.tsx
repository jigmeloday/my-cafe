import { getServerSession } from 'next-auth';
import CreateCafe from '@/components/cafe/cafe-owner/create-cafe';
import { authOptions } from '../../../../../../auth';
import { redirect } from 'next/navigation';
import { fetchRole } from '@/lib/action/get-role.action';
import { permissionChecker } from '@/lib/utils';
import { Role } from '../../../../../../types';

async function Page() {
  const session = await getServerSession(authOptions);
  const roles = await fetchRole();
  const permission = permissionChecker(
    session?.user.role as string,
    roles as Role[]
  );

  if (!permission) {
    redirect('/404');
  }

  return <CreateCafe roles={roles} />;
}

export default Page;
