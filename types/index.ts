import { z } from 'zod';
import { INSERT_CAFE_SCHEMA, INSERT_MENU_SCHEMA } from '@/lib/validator';

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