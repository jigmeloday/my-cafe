'use server';
import { SIGN_UP_SCHEMA } from '../validator';
import { hashSync } from 'bcrypt-ts-edge';
import { SignupType } from '../../../types';
import { PrismaClient } from '@/generated/prisma';
import { randomBytes } from 'crypto';
import { sendEmail } from '@/lib/email';
import { handleError } from '../utils';

export const signUpWithCredentials = async (formData: SignupType) => {
  const prisma = new PrismaClient();
  try {
    const user = SIGN_UP_SCHEMA.parse({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      userType: formData.userType,
    });

    user.password = hashSync(user.password, 10);
    const role = await prisma.role.findUnique({
      where: { name: user.userType }, // 'user' or 'owner'
    });
    if (!role) {
      throw new Error('Role not found');
    }
    const verificationToken = randomBytes(32).toString('hex');
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        payment: '',
        emailVerified: null,
        verificationToken,
        role: {
          connect: { id: role.id },
        },
      },
    });
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`,
    });
    return {
      success: true,
      message: 'Sign up successful. Please verify your email.',
    };
  } catch (error) {
    const { message } =  handleError(error)
    return{
      success: false,
      message
    }
  }
};
