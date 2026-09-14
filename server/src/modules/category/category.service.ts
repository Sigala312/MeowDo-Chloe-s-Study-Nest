import { prisma } from '../../lib/prisma.js'; // 👈 1. 改用共用的 prisma 實例
import { CreateCategoryInput, UpdateCategoryInput } from './category.schema.js';
import { NotificationService } from '../Notification/notification.service.js'; // 👈 1. 引入 NotificationService

export class CategoryService {
  // 1. 取得該使用者的所有分類
  static async getCategories(userId: string) {
    return await prisma.category.findMany({
      where: { userId },
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { tasks: true },
        },
      },
    });
  }

  // 2. 建立新分類
  static async createCategory(userId: string, data: CreateCategoryInput) {
    const existingCategory = await prisma.category.findUnique({
      where: {
        name_userId: {
          name: data.name,
          userId,
        },
      },
    });

    if (existingCategory) {
      throw new Error('CATEGORY_EXISTS');
    }

    // 建立分類
    const newCategory = await prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });

    // 👈 2. 成功建立分類後，觸發新增分類通知
    try {
      await NotificationService.notifyCategoryCreated(userId, newCategory.name);
    } catch (error) {
      // 避免通知發送失敗導致整個分類建立 API 崩潰，這裡可以只印出錯誤記錄
      console.error('Failed to send category created notification:', error);
    }

    return newCategory;
  }

  // 3. 更新分類
  static async updateCategory(id: string, userId: string, data: UpdateCategoryInput) {
    // 確保要修改的分類屬於該使用者
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    // 👈 2. 新增：如果更改了名稱，檢查新名稱是否與該使用者的其他分類重複
    if (data.name && data.name !== category.name) {
      const nameConflict = await prisma.category.findUnique({
        where: {
          name_userId: {
            name: data.name,
            userId,
          },
        },
      });

      if (nameConflict) {
        throw new Error('CATEGORY_EXISTS');
      }
    }

    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  // 4. 刪除分類
  static async deleteCategory(id: string, userId: string) {
    const category = await prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    return await prisma.category.delete({
      where: { id },
    });
  }
}