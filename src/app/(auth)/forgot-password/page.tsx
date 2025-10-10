'use client'
import Confirmation from '@/components/auth/confirmation';
import ForgotPasswordForm from '@/components/auth/forgot-password-form';
import Link from 'next/link';
import { useState } from 'react';

function Page() {
  const [nextStep, setNextStep] = useState(false);

  return(
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex items-center justify-center border size-[80px] rounded-full">
        LOGO
      </div>
     {
      nextStep ? <>
      <Confirmation />
      </> : <>
       <ForgotPasswordForm setNextStep={setNextStep} />
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
            Back to {' '}
            <Link
              className="text-primary-500 font-bold text-[14px] hover:text-primary-700 transition duration-300 ease-in-out"
              href="/sign-in"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
      </>
     }
    </div>
  )
}

export default Page;