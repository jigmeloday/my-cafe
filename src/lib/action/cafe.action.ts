'use server';
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject } from '../utils';

export const CafeList = async ({ limit }: { limit?: number }) => {
  const prisma = new PrismaClient();
  const data = await prisma.cafe.findMany({ take: limit || 10, orderBy: { createdAt: 'asc' } })
  return converToPlanObject(data);
}