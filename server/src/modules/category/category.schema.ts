import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required.').max(20, 'Category name must be 20 characters or less.'),
  icon: z.string().optional().default('📁'), // 預設使用 Icon 或 Emoji
  color: z.string().optional(),
  order: z.number().int().default(0),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;