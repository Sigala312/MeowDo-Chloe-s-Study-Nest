import { prisma } from '../../lib/prisma.js';
import { CreateTagInput, UpdateTagInput } from './tag.schema.js';
import { NotificationService } from '../Notification/notification.service.js';

export class TagService {
  // 1. 取得該使用者的所有標籤
  static async getTags(userId: string) {
    return await prisma.tag.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true }, // 統計有多少任務使用此標籤
        },
      },
    });
  }

  // 2. 建立新標籤
  static async createTag(userId: string, data: CreateTagInput) {
    const existingTag = await prisma.tag.findFirst({
      where: {
        name: data.name,
        userId,
      },
    });

    if (existingTag) {
      throw new Error('TAG_EXISTS');
    }

    const newTag = await prisma.tag.create({
      data: {
        ...data,
        userId,
      },
    });

    // 👈 2. 成功建立標籤後觸發通知
    try {
      await NotificationService.notifyTagCreated(userId, newTag.name);
    } catch (error) {
      console.error('Failed to send tag created notification:', error);
    }

    return newTag;
  }

  // 3. 更新標籤
  static async updateTag(id: string, userId: string, data: UpdateTagInput) {
    const tag = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!tag) {
      throw new Error('TAG_NOT_FOUND');
    }

    if (data.name && data.name !== tag.name) {
      const nameConflict = await prisma.tag.findFirst({
        where: { name: data.name, userId },
      });

      if (nameConflict) {
        throw new Error('TAG_EXISTS');
      }
    }

    return await prisma.tag.update({
      where: { id },
      data,
    });
  }

  // 4. 刪除標籤
  static async deleteTag(id: string, userId: string) {
    const tag = await prisma.tag.findFirst({
      where: { id, userId },
    });

    if (!tag) {
      throw new Error('TAG_NOT_FOUND');
    }

    return await prisma.tag.delete({
      where: { id },
    });
  }
}