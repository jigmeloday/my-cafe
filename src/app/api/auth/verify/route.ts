import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const token = new URL(req.url).searchParams.get('token');
    if (!token) {
      const redirectUrl = `${process.env.NEXTAUTH_URL}/?error=TokenMissing`;
      return NextResponse.redirect(redirectUrl);
    }

    const user = await prisma.user.findFirst({ where: { verificationToken: token } });
    if (!user) {
      const redirectUrl = `${process.env.NEXTAUTH_URL}/?error=InvalidToken&token=${token}`;
      return NextResponse.redirect(redirectUrl);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verificationToken: null },
    });

    // Success redirect
    const successUrl = `${process.env.NEXTAUTH_URL}/sign-in?verified=true`;
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error(error);
    const redirectUrl = `${process.env.NEXTAUTH_URL}/?error=ServerError`;
    return NextResponse.redirect(redirectUrl);
  }
}
