import { NextResponse } from 'next/server';
import { hashSync } from 'bcrypt-ts-edge';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  const { token, password } = await req.json();
  if (!token) {
    return NextResponse.json(
      { message: 'Token is missing' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findFirst({
    where: { 
      resetToken: token, 
      resetTokenExpiry: { gt: new Date() } 
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: 'Invalid or expired token' },
      { status: 400 }
    );
  }

  const hashedPassword = hashSync(password, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  return NextResponse.json({ message: 'Password reset successfully' });
}
