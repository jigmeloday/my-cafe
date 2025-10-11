import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/');
  }
  return (
    <main>
      <div className="p-4 shadow-lg border">
        <Link href="/">
          <ChevronLeft className="cursor-pointer text-primary-500 hover:text-primary-700 transition duration-300 ease-in-out hover:scale-110" />
        </Link>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#FFF2F2]">
        <div className="flex items-center justify-center shadow-lg rounded-md shadow-primary-500/10 max-w-md w-full max-auto p-[40px]">
          {children}
        </div>
      </div>
    </main>
  );
}
