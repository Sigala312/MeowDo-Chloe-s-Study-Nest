import { z } from 'zod';

export const CreateTagSchema = z.object({
  name: z
    .string()
    .min(1, 'Tag name is required.')
    .max(15, 'Tag name must be 15 characters or less.')
    .transform((val) => (val.startsWith('#') ? val : `#${val}`)), // 自動補上 # 前綴
  color: z.string().optional(),
});

export const UpdateTagSchema = CreateTagSchema.partial();

export type CreateTagInput = z.infer<typeof CreateTagSchema>;
export type UpdateTagInput = z.infer<typeof UpdateTagSchema>;