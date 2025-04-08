import { z } from 'zod';
import { Role } from '@prisma/client';

/* -------------------------------------------------------------------------- */
/*                                  REGISTER                                  */
/* -------------------------------------------------------------------------- */

export const emailSchema = z.object({
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
});

export const completeRegisterSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long')
    .regex(/^[A-Za-z\s]+$/, 'Name can only contain letters and spaces'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(30, 'Username must be at least 30 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscore',
    ),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  reTypePassword: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(Role),
  referralCode: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/*                                    LOGIN                                   */
/* -------------------------------------------------------------------------- */

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

// -------
// Zod Validation Schemas
export const StoreAdminSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.nativeEnum(Role),
  username: z.string().min(1),
  storeId: z.string().min(1),
});

// ------
export const confirmPasswordResetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

// password: z.string().min(6)
