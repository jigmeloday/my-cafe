'use server'
import { PrismaClient } from '@/generated/prisma';
import { converToPlanObject } from '../utils';

export const fetchRole = async () => {
  const prisma = new PrismaClient();
  try{
    const role = await prisma.role.findMany({
      where: {
        name: {
          in: ['super_admin', 'owner'],
        }
      }
    });
    return converToPlanObject(role)
  } catch(error) {
     console.error('Failed to fetch cafes:', error);
    return []
  }
}