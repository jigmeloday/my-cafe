import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth';
import { redirect } from "next/navigation";

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FFFFFF] to-[#FFF2F2]">
        <div className="flex items-center justify-center shadow-lg rounded-md shadow-primary-500/10 max-w-md w-full max-auto p-[40px]">
          {children}
        </div>
      </div>
    </main>
  );
}
