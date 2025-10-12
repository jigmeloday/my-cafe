import { z } from 'zod';
import {
  FORGOT_PASSWORD_SCHEMA,
  INSERT_BANNER_SCHEMA,
  INSERT_CAFE_SCHEMA,
  INSERT_MENU_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
} from '@/lib/validator';

export type CafeType = z.infer<typeof INSERT_CAFE_SCHEMA> & {
  id?: string;
  createdAt?: Date | string;
};

export type MenuType = z.infer<typeof INSERT_MENU_SCHEMA> & {
  id: string;
  createdAt: Date | string;
  cafe: {
    name: string;
  };
};

export type BannerType = z.infer<typeof INSERT_BANNER_SCHEMA> & {
  id: string;
  cafe: {
    name: string;
  };
};

export type SigninType = z.infer<typeof SIGN_IN_SCHEMA>;
export type SignupType = z.infer<typeof SIGN_UP_SCHEMA>;
export type ResetPasswordType = z.infer<typeof RESET_PASSWORD_SCHEMA> & {
  token?: string;
};
export type ForgotPasswordType = z.infer<typeof FORGOT_PASSWORD_SCHEMA>;
export interface PageProps {
  params: Promise<{ slug: string }>;
}
export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export type NodataPropsType = {
  title: string;
  description: string;
  buttonText?: string;
  action: (value: boolean) => void;
};

export interface ImageUploaderProps {
  onChange: (file: File | null) => void;
  value?: File | null;
  label?: string;
  className?: string;
  previewUrl?: string;
}

export type Role = {
  name: string;
  id: string;
};

export interface SheetOpenerProps {
  setOpen: (value: boolean) => void;
  cafeId?: string;
  userId?: string;
}

export interface DialogPropsType {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  btn1: string;
  btn2: string;
}
