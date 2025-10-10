import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendEmail } from '@/lib/email'; // your nodemailer function

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'If this email exists, a reset link was sent.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 1000 * 60 * 15); // valid for 15 minutes

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expiry },
  });

  const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;
  await sendEmail({
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });

  return NextResponse.json({ message: 'Reset email sent if account exists.' });
}
