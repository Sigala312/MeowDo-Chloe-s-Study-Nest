import { z } from 'zod';

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(50, 'Name is too long.').optional(),
  bio: z.string().max(200, 'Bio must be under 200 characters.').nullable().optional(),
  avatarUrl: z.string().url('Invalid image URL.').nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;