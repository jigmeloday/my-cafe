'use client';
import { Input } from '../ui/input';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { SignupType } from '../../../types';
import { useState } from 'react';
import { SIGN_UP_SCHEMA } from '@/lib/validator';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { signUpWithCredentials } from '@/lib/action/registratio.action';

function SignupForm() {
  const route = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(SIGN_UP_SCHEMA),
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: SignupType) => {
    const result = await signUpWithCredentials(data);

    if (result.success) {
      toast.success(result.message);
      route.push('/');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <form
      className="my-[32px] w-full space-y-[24px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-[16px]">
        {/* Email */}
        <Input
          placeholder="Name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          placeholder="Email"
          {...register('email')}
          error={errors.email?.message}
        />

        {/* Password */}
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          {...register('password')}
          error={errors.password?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {/* Confirm Password */}
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm Password"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />

        {/* User Type Dropdown */}
        <Controller
          name="userType"
          control={control}
          render={({ field, fieldState }) => (
            <Select onValueChange={field.onChange} value={field.value ?? ''}>
              <SelectTrigger className='[&[data-placeholder]]:text-black/50' error={fieldState.error?.message}>
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="owner">Cafe Owner</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      {/* Submit button */}
      <Button disabled={isSubmitting} className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
}

export default SignupForm;
