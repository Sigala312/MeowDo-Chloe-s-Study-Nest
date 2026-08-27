import { z } from 'zod';

// Email 註冊 Schema
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Email 登入 Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Apple 登入 Schema
export const appleAuthSchema = z.object({
  identityToken: z.string().min(1, 'Identity token is required'),
  user: z
    .object({
      name: z
        .object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
        })
        .optional(),
      email: z.string().email().optional(),
    })
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AppleAuthInput = z.infer<typeof appleAuthSchema>;