'use client';
// import { SIGN_IN_SCHEMA } from '../validator';
import { SigninType } from '../../../types';
import { signIn, signOut } from 'next-auth/react';

export const signInWithCredentials = async (formData: SigninType) => {
  try {
    // const user = SIGN_IN_SCHEMA.parse({
    //   email: formData.email,
    //   password: formData.password,
    // });
    await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    });
    return {
      success: true,
      message: 'Sign in successfully',
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
};

export const signoutUser = async () => {
  await signOut();
};
