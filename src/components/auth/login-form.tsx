'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { SIGN_IN_SCHEMA } from '../../lib/validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithCredentials } from '@/lib/action/user.action';
import { SigninType } from '../../../types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function LoginForm() {
  const route = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SIGN_IN_SCHEMA),
  });

  const onSubmit = async (data: SigninType) => {
    const result = await signInWithCredentials(data);

    if (result.success) {
      toast.success(result.message);
      route.push('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      className="my-[32px] w-full space-y-[16px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-[16px]">
        <Input
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <div className="w-full flex justify-end mt-[12px]">
        <Link
          className="text-primary-500 hover:text-primary-700 transition duration-300 ease-in-out text-[14px] font-bold"
          href="/forgot-password"
        >
          Forgot password?
        </Link>
      </div>

      <Button disabled={isSubmitting} className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export default LoginForm;
