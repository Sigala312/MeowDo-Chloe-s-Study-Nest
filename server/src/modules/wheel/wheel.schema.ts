import { z } from 'zod';

export const createRewardSchema = z.object({
  title: z.string().min(1, '請輸入獎品名稱'),
  icon: z.string().optional(),
  categoryTag: z.string().optional(),
  probability: z.number().min(0).max(1, '機率必須介於 0 到 1 之間'),
  isRare: z.boolean().default(false),
});

export const redeemRewardSchema = z.object({
  drawLogId: z.string().min(1, '請提供抽獎紀錄 ID'),
});

export type CreateRewardInput = z.infer<typeof createRewardSchema>;
export type RedeemRewardInput = z.infer<typeof redeemRewardSchema>;