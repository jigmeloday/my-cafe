import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) {
    return NextResponse.json({ success: false, message: 'Token missing' });
  }

  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: {
        gt: new Date(), // token must not be expired
      },
    },
  });

  if (!user) {
    return NextResponse.json({ success: false, message: 'Invalid or expired token' });
  }

  return NextResponse.json({ success: true, message: 'Token is valid' });
}
