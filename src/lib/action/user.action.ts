'use client';
import { SigninType } from '../../../types';
import { signIn, signOut } from 'next-auth/react';
import { SIGN_IN_SCHEMA } from '../validator';

export const signInWithCredentials = async (formData: SigninType) => {
  try {
    const user = SIGN_IN_SCHEMA.parse({
      email: formData.email,
      password: formData.password,
    });
    const result = await signIn('credentials', {
      ...user,
      redirect: false,
    });

    if (result?.error) {
    return { success: false, message: result.error };
  }

  return { success: true, message: 'Sign in successfully' };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Invalid email or password',
    };
  }
};

export const signoutUser = async () => {
  try {
    await signOut({ redirect: false });
    return { success: true, message: 'Signed out successfully.' };
  } catch (error) {
    console.error('Error signing out:', error);
    return { success: false, message: 'Failed to sign out. Please try again.' };
  }
};


