import { prisma } from '../../lib/prisma.js';
import { NotificationType } from '@prisma/client';
import { CreateNotificationDto } from './notification.schema.js';

export class NotificationService {
  /**
   * 1. 取得使用者的所有通知（可依是否已讀篩選）
   */
  static async getUserNotifications(userId: string, isRead?: boolean) {
    const whereClause: any = { userId };
    if (isRead !== undefined) {
      whereClause.isRead = isRead;
    }

    return await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 50, // 預設限制最近 50 筆
    });
  }

  /**
   * 2. 取得未讀通知數量
   */
  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  /**
   * 3. 標記通知為已讀（單筆或多筆，若不傳 ids 則全部標記已讀）
   */
  static async markAsRead(userId: string, notificationIds?: string[]) {
    if (notificationIds && notificationIds.length > 0) {
      return await prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          userId,
        },
        data: { isRead: true },
      });
    } else {
      return await prisma.notification.updateMany({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    }
  }

  /**
   * 4. 刪除通知
   */
  static async deleteNotification(userId: string, notificationId: string) {
    return await prisma.notification.delete({
      where: { id: notificationId, userId },
    });
  }

  /**
   * 通用建立通知方法
   */
  static async createNotification(userId: string, dto: CreateNotificationDto) {
    return await prisma.notification.create({
      data: {
        userId,
        type: dto.type,
        title: dto.title,
        content: dto.content,
        linkUrl: dto.linkUrl,
      },
    });
  }

  // ==========================================
  // 🎯 針對 7 種指定狀況的快捷觸發函式
  // ==========================================

  // (1) 新增分類
  static async notifyCategoryCreated(userId: string, categoryName: string) {
    return await this.createNotification(userId, {
      type: NotificationType.SYSTEM,
      title: '📁 新分類建立成功',
      content: `您已成功建立新分類「${categoryName}」。`,
      linkUrl: '/categories',
    });
  }

  // (2) 新增標籤
  static async notifyTagCreated(userId: string, tagName: string) {
    return await this.createNotification(userId, {
      type: NotificationType.SYSTEM,
      title: '🏷️ 新標籤建立成功',
      content: `您已成功建立新標籤「${tagName}」。`,
      linkUrl: '/tags',
    });
  }

  // (3) 待辦事項提醒
  static async notifyTaskReminder(userId: string, taskTitle: string, taskTime?: string) {
    return await this.createNotification(userId, {
      type: NotificationType.TASK,
      title: '⏰ 待辦事項提醒',
      content: `您的待辦事項「${taskTitle}」${taskTime ? `將於 ${taskTime}` : '即將'}到期，請記得完成！`,
      linkUrl: '/tasks',
    });
  }

  // (4) 得到 30 個貓罐頭
  static async notifyCatFoodEarned(userId: string, amount: number = 30) {
    return await this.createNotification(userId, {
      type: NotificationType.GAMIFY,
      title: '🐟 獲得貓罐頭獎勵！',
      content: `恭喜您達成任務，獲得了 ${amount} 個美味貓罐頭！`,
      linkUrl: '/rewards',
    });
  }

  // (5) 轉盤抽獎結果
  static async notifyWheelResult(userId: string, prizeName: string) {
    return await this.createNotification(userId, {
      type: NotificationType.REWARD,
      title: '🎡 轉盤抽獎結果出爐',
      content: `您在幸運轉盤中抽中了「${prizeName}」！快去查看背包吧！`,
      linkUrl: '/wheel',
    });
  }

  // (6) 個人資料更換
  static async notifyProfileUpdated(userId: string) {
    return await this.createNotification(userId, {
      type: NotificationType.SYSTEM,
      title: '✨ 個人資料已更新',
      content: '您的個人檔案與資料已成功儲存並更新。',
      linkUrl: '/profile',
    });
  }

  // (7) 每月任務完成度匯報
  static async notifyMonthlyReport(userId: string, completionRate: number) {
    return await this.createNotification(userId, {
      type: NotificationType.SYSTEM,
      title: '📊 每月任務完成度匯報',
      content: `您本月的任務完成度為 ${completionRate}%！繼續保持，迎向更美好的 cozy 生活！`,
      linkUrl: '/tasks',
    });
  }
}