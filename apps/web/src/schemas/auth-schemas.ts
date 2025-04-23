import { z } from 'zod';

const Role = {
  CUSTOMERS: 'CUSTOMERS',
  STOREADMIN: 'STOREADMIN',
  SUPERADMIN: 'SUPERADMIN',
};

export const registerSchema = z.object({
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
  email: z.string().email('Invalid email format'),
  role: z.nativeEnum(Role).optional(),
  referralCode: z.string().optional(),
});

export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
