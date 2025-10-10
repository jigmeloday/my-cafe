import { z } from 'zod';
import { INSERT_BANNER_SCHEMA, INSERT_CAFE_SCHEMA, INSERT_MENU_SCHEMA, SIGN_IN_SCHEMA, SIGN_UP_SCHEMA } from '@/lib/validator';

export type CafeType =z.infer<typeof INSERT_CAFE_SCHEMA> & {
  id: string;
  createdAt: Date | string;
}


export type MenuType =z.infer<typeof INSERT_MENU_SCHEMA> & {
  id: string;
  createdAt: Date | string;
  cafe: {
    name: string
  }
}


export type BannerType = z.infer<typeof INSERT_BANNER_SCHEMA> & {
  id: string
  cafe: {
    name: string;
  }
}

export type SigninType = z.infer<typeof SIGN_IN_SCHEMA> 
export type SignupType = z.infer<typeof SIGN_UP_SCHEMA> 