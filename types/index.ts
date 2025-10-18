import { z } from 'zod';
import {
  FORGOT_PASSWORD_SCHEMA,
  INSERT_ADDRESS_SCHEMA,
  INSERT_BANNER_SCHEMA,
  INSERT_CAFE_SCHEMA,
  INSERT_MENU_SCHEMA,
  RESET_PASSWORD_SCHEMA,
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
} from '@/lib/validator';
import { Address } from '@/generated/prisma';

export type CafeType = z.infer<typeof INSERT_CAFE_SCHEMA> & {
  id?: string;
  logo?: string
  addresses?: Address[];
  createdAt?: Date | string;
  totalStars?: number;
};

export type MenuType = z.infer<typeof INSERT_MENU_SCHEMA> & {
  id?: string;
  createdAt?: Date | string;
  Images?: Images[], 
  totalStars?: number;
  cafe?: {
    name: string;
  };
};

export interface Images {
  url: string
}

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
  className?: string;
  action?: (value: boolean) => void;
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
  setCafe: (value: CafeType | null) => void;
  onSave?: (updatedCafe: CafeType) => void;
}

export interface DialogPropsType {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  btn1: string;
  btn2: string;
  isDisabled?: boolean;
}

export type ResponseType = {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
};

export interface FilterComponentProps {
  filters: {
    search: string;
    closed?: boolean;
    feature?: boolean;
    openTime?: string;
    closeTime?: string;
    sortBy?: string;
  };
  onChange: (filters: FilterComponentProps['filters']) => void;
  onReset: () => void;
}

export interface Filters {
  search: string;
  closed?: boolean;
  feature?: boolean; // optional boolean
  openTime?: string;
  closeTime?: string;
  sortBy: string;
}

export interface CafeListResponse {
  cafes: CafeType[];
  totalCount: number;
}

export type ReviewsResponse = {
  success: boolean;
  reviews: Review[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  ratings: RatingsInfo;
};
export type Review = {
  id: string;
  rating?: number | null;
  comment?: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type RatingsInfo = {
  starCounts: Record<number, number>;
  starPercentages: Record<number, number>;
  overallScore: number;
};

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OverviewTabProps {
  cafe: CafeType;
}

export interface Ratings {
  overallScore: number;
  starPercentages: Record<number, number>; // 1-5 stars
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination | null;
}
export interface CategoryType {
  id: string;
  name: string
}

export type AddressType = z.infer<typeof INSERT_ADDRESS_SCHEMA> & {
  cafeId?: string
  userId?: string
  id?: string
};