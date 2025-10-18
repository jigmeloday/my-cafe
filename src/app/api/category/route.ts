// app/api/category/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();
let categoriesCache: { id: string; name: string }[] | null = null;

export async function GET(req: NextRequest) {
  try {

    if (!categoriesCache) {
      categoriesCache = await prisma.category.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
    } 
    return NextResponse.json({
      data: categoriesCache,
      success: true,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error || 'Failed to fetch categories', success: false },
      { status: 500 }
    );
  }
}
