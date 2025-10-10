'use client';
import Link from 'next/link';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FORGOT_PASSWORD_SCHEMA } from '@/lib/validator';
import { ForgotPasswordType } from '../../../types';
import { resetPassword } from '@/lib/action/password';
import { toast } from 'sonner';

function ForgotPasswordForm({
  setNextStep,
}: {
  setNextStep: (value: boolean) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FORGOT_PASSWORD_SCHEMA),
  });

  const onSubmit = async (data: ForgotPasswordType) => {
    const response = await resetPassword(data);
    if (response.success) {
      toast.success(response.message || 'Password reset successful!');
    } else {
      toast.error(response.message || 'Failed to reset password.');
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
          {...register('email', { required: 'Email is required' })}
          error={errors.email?.message}
        />
      </div>

      <Button disabled={isSubmitting} className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export default ForgotPasswordForm;
