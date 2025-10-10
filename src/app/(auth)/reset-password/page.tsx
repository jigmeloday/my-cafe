import ResetPasswordForm from '@/components/auth/reset-password-form';
import { validateToken } from '@/lib/action/password';
import Image from 'next/image';
import Link from 'next/link';
interface PageProps {
  searchParams: { token?: string };
}
async function Page({ searchParams }: PageProps) {
  const token = searchParams?.token;
  let tokenRes;

  if (token) {
    tokenRes = await validateToken(token as string);
  } else {
    tokenRes = { success: false, message: 'Invalid or expired token' };
  }

  if (token || tokenRes.message === 'Invalid or expired token') {
    return (
      <div className="flex flex-col items-center justify-center text-center px-4">
        <div>
          <Image
            src="/svg/sorry.svg"
            alt="Sorry"
            height={300}
            width={300}
            className="mb-6"
          />
        </div>
        <h4 className="mb-2 flex items-center space-x-2">
          <span>Oops!</span>
        </h4>
        <p className="mt-2 text-gray-700 text-base max-w-md">
          This link is invalid or has expired. You can{' '}
          <Link
            href="/forgot-password"
            className="text-red-500 font-semibold hover:underline"
          >
            request a new reset link
          </Link>
          . .
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-center border size-[80px] rounded-full">
        LOGO
      </div>
      <ResetPasswordForm />
      <div className="flex flex-col items-center w-full">
        <div className="flex flex-col items-center w-full">
          <div className="flex w-full items-center space-x-4">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-primary-100 to-primary-100 rounded-full" />
            <p className="text-primary-300 font-medium">OR</p>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-primary-100 via-primary-100 to-transparent" />
          </div>
        </div>
        <div className="mt-[12px]">
          <p className="text-[12px] text-black/80">
            Back to{' '}
            <Link
              className="text-primary-500 font-bold text-[14px] hover:text-primary-700 transition duration-300 ease-in-out"
              href="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
