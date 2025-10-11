import { Prisma } from '@/generated/prisma';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';
import { Role } from '../../types';
import { MenuItem } from '@/components/ui/menu-action';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const converToPlanObject = <T>(value: T): T => {
  return JSON.parse(JSON.stringify(value));
};

// src/lib/error-handler.ts
interface ErrorInfo {
  title: string;
  message: string;
  suggestion?: string;
}

type AuthErrorType =
  | 'CredentialsSignin'
  | 'OAuthAccountNotLinked'
  | 'AccessDenied'
  | 'Verification'
  | 'Email not verify'
  | 'Configuration'
  | string;

/**
 * 🧠 Universal Error Handler
 * Handles Zod, Auth, API, and generic errors in one place.
 */
export function handleError(error: unknown): {
  success: false;
  title?: string;
  message: string;
  suggestion?: string;
  details?: { path: string; message: string }[];
} {
  // ✅ 1. Zod Validation Errors
  if (error instanceof ZodError) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const details = error.issues.map((err: any) => ({
      path: err.path.join('.'),
      message: err.message,
    }));

    return {
      success: false,
      title: 'Validation Error',
      message: details.map((e) => e.message).join(', '),
      details,
    };
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint failed
        const target = Array.isArray(error.meta?.target)
          ? error.meta?.target[0]
          : (error.meta?.target as string | undefined);

        const field =
          target?.charAt(0).toUpperCase() + target?.slice(1) || 'Field';

        return {
          success: false,
          title: 'Duplicate Entry',
          message: `${field || 'field'} already exists.`,
          suggestion:
            'Try using a different value or log in if you already have an account.',
        };

      case 'P2025': // Record not found
        return {
          success: false,
          title: 'Record Not Found',
          message:
            'The record you are trying to update or delete does not exist.',
        };

      default:
        return {
          success: false,
          title: 'Database Error',
          message: 'An unexpected database error occurred.',
        };
    }
  }

  // ✅ 2. Auth / NextAuth Errors
  if (typeof error === 'string') {
    const e = error as AuthErrorType;
    switch (e) {
      case 'CredentialsSignin':
        return {
          success: false,
          title: 'Invalid Credentials',
          message: 'The email or password you entered is incorrect.',
          suggestion: 'Please try again or reset your password.',
        };
      case 'OAuthAccountNotLinked':
        return {
          success: false,
          title: 'Account Conflict',
          message: 'An account already exists with this email address.',
          suggestion: 'Try signing in using your original login method.',
        };
      case 'AccessDenied':
        return {
          success: false,
          title: 'Access Denied',
          message: 'You do not have permission to access this page.',
        };
      case 'Verification':
        return {
          success: false,
          title: 'Verification Failed',
          message: 'The verification link is invalid or has expired.',
          suggestion: 'Please request a new verification email.',
        };
      case 'Configuration':
        return {
          success: false,
          title: 'Server Configuration Error',
          message: 'There was an issue with the authentication setup.',
        };

      case 'Email not verify':
        return {
          success: false,
          title: 'Email Not Verified',
          message: 'Your email address has not been verified yet.',
        };
      default:
        return {
          success: false,
          title: 'Authentication Error',
          message: 'Something went wrong during',
          suggestion: 'Please try again later.',
        };
    }
  }

  // ✅ 3. Normal JS or Server Errors
  if (error instanceof Error) {
    return {
      success: false,
      title: 'Error',
      message: error.message || 'Unexpected error occurred.',
    };
  }

  // ✅ 4. Fallback for unknown cases
  return {
    success: false,
    title: 'Unknown Error',
    message: 'Something went wrong. Please try again later.',
  };
}


export const permissionCheckerAdmin = (roleName: string, roles:Role[]) => {
  return roles?.some( ({ name }) => name === roleName) 
}


export const permissionChecker = ( roleName: string, roles:Role[]) => {
  return roles?.some(({ name }) => name === roleName)
}


export const cafeMenuItems = (callbacks: {
  isClosed: boolean
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
}): MenuItem[] => [
  { label: 'Edit My Cafe', onClick: callbacks.onEdit },
  { label: callbacks.isClosed ? 'We are open' : 'We are closed', onClick: callbacks.onClose, separator: true },
  {
    label: 'Delete this Cafe',
    onClick: callbacks.onDelete,
    className:
      'text-primary-500 hover:text-primary-700 transition-all duration-500 ease-in-out',
    separator: true,
  },
];