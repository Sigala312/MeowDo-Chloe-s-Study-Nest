import { z } from 'zod';
import { NotificationType } from '@prisma/client';

// 建立通知的 Schema（主要由系統內部或特定業務邏輯呼叫）
export const createNotificationSchema = z.object({
  type: z.nativeEnum(NotificationType).default(NotificationType.SYSTEM),
  title: z.string().min(1, 'Notification title is required'),
  content: z.string().min(1, 'Notification content is required'),
  linkUrl: z.string().optional(),
});

// 標記已讀的 Schema
export const markAsReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(), // 若不傳則代表全部標記已讀
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;
export type MarkAsReadDto = z.infer<typeof markAsReadSchema>;