'use server'
import { SIGN_UP_SCHEMA } from '../validator';
import { hashSync } from 'bcrypt-ts-edge';
import { SignupType } from '../../../types';
import { PrismaClient } from '@/generated/prisma';


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
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        payment: '',
        role: {
          connect: { id: role.id },
        },
      },
    });
    return {
      success: true,
      message: 'Sign up successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Invalid data or email already exists',
    };
  }
};