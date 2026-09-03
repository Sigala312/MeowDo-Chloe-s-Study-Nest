import { z } from 'zod';

// 建立 Task 的 Request Body 驗證
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(100),
  // 移除 .optional().nullable()，強制必填
  categoryId: z.string().cuid('Invalid Category ID'), 
  tags: z.array(z.string()).optional().default([]),
  dueDate: z.string().datetime().optional().nullable().transform((val) => val ?? undefined),
  description: z.string().optional(),
});

// 更新 Task 的 Request Body 驗證 (全部欄位皆為可選)
export const updateTaskSchema = createTaskSchema.partial().extend({
  isCompleted: z.boolean().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;