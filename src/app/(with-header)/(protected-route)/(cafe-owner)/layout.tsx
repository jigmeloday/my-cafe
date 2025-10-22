import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../../../../../auth';

export default async function OwnerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
    if (!session) {
      redirect('/');
    }
  return (
   <main>
    {children}
   </main>
  );
}
