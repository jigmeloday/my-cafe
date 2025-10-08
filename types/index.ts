import { z } from 'zod';
import { INSERT_CAFE_SCHEMA } from '@/lib/validator';

export type CafeType =z.infer<typeof INSERT_CAFE_SCHEMA> & {
  id: string;
  createdAt: Date | string;
}