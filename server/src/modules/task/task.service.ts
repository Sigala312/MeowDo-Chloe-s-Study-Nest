import { PrismaClient } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput } from './task.schema.js';

const prisma = new PrismaClient();

export class TaskService {
  // 取得使用者的所有 Tasks (包含關聯的 Category 與 Tags)
  static async getTasksByUserId(userId: string) {
    return await prisma.task.findMany({
      where: { userId },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 取得單一 Task
  static async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
      include: { category: true, tags: true },
    });
    if (!task) throw new Error('Task not found');
    return task;
  }

  // 建立 Task
  static async createTask(userId: string, input: CreateTaskInput) {
    const { title, categoryId, tags, dueDate, description } = input;

    // 使用 Prisma 複合鍵 name_userId 進行條件匹配
    const tagConnectOrCreate = (tags || []).map((tagName) => ({
      where: {
        name_userId: {
          name: tagName,
          userId: userId,
        },
      },
      create: {
        name: tagName,
        userId: userId,
      },
    }));

    return await prisma.task.create({
      data: {
        title,
        userId,
        categoryId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        description,
        tags: {
          connectOrCreate: tagConnectOrCreate,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });
  }

  static async updateTask(taskId: string, userId: string, input: UpdateTaskInput) {
  const { title, categoryId, tags, dueDate, isCompleted, description } = input;

  return await prisma.task.update({
    where: {
      id: taskId,
      userId: userId,
    },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(isCompleted !== undefined && { 
        isCompleted,
        completedAt: isCompleted ? new Date() : null,
      }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),

      ...(categoryId !== undefined && {
        category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
      }),

      // 關鍵修正：使用 set 與 connectOrCreate
      ...(tags && {
        tags: {
          // 1. 先重置與舊標籤的關聯
          set: [],
          // 2. 使用複合唯一鍵 `name_userId` 來做 connectOrCreate
          connectOrCreate: tags.map((tagName: string) => ({
            where: {
              name_userId: {
                name: tagName,
                userId: userId,
              },
            },
            create: {
              name: tagName,
              userId: userId,
            },
          })),
        },
      }),
    },
    include: {
      category: true,
      tags: true,
    },
  });
}

  // 刪除 Task
  static async deleteTask(taskId: string, userId: string) {
    await this.getTaskById(taskId, userId);
    return await prisma.task.delete({
      where: { id: taskId },
    });
  }
}