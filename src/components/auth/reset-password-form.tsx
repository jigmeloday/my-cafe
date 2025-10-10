'use client';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RESET_PASSWORD_SCHEMA } from '@/lib/validator';
import { ResetPasswordType } from '../../../types';
import { useState } from 'react';

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RESET_PASSWORD_SCHEMA),
  });

  const onSubmit = async (data: ResetPasswordType) => {
    // const result = await signInWithCredentials(data);
    // if (result.success) {
    //   toast.success(result.message);
    //   route.push('/');
    // } else {
    //   toast.error(result.message);
    // }
  };
  return (
    <form
      className="my-[32px] w-full space-y-[16px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-[16px]">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          {...register('password', { required: 'Password is required' })}
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
      </div>

      <Button disabled={isSubmitting} className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export default ResetPasswordForm;
