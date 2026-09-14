import { Request, Response } from 'express';
import { NotificationService } from './notification.service.js';
import { markAsReadSchema } from './notification.schema.js';

export class NotificationController {
  // 取得使用者通知列表
  static async getNotifications(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id; // 假設透過 Auth 中介軟體帶入
      const isReadParam = req.query.isRead;
      let isRead: boolean | undefined = undefined;

      if (isReadParam === 'true') isRead = true;
      if (isReadParam === 'false') isRead = false;

      const notifications = await NotificationService.getUserNotifications(userId, isRead);
      return res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 取得未讀通知數量
  static async getUnreadCount(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const count = await NotificationService.getUnreadCount(userId);
      return res.status(200).json({ success: true, data: { count } });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 標記已讀
  static async markAsRead(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const validation = markAsReadSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({ success: false, errors: validation.error.format() });
      }

      const { notificationIds } = validation.data;
      const result = await NotificationService.markAsRead(userId, notificationIds);

      return res.status(200).json({ success: true, message: 'Notifications marked as read', data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // 刪除通知
  static async deleteNotification(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const { id } = req.params;

      await NotificationService.deleteNotification(userId, id as string);
      return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}