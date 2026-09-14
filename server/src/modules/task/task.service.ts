import { prisma } from '../../lib/prisma.js'; // 統一使用專案內的單例 PrismaClient
import { CreateTaskInput, UpdateTaskInput } from './task.schema.js';
import { WheelService } from '../wheel/wheel.service.js';
import { NotificationService } from '../Notification/notification.service.js';

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
    const { title, categoryId, tags = [], dueDate, description } = input;

    // 1. 取得使用者現有的 Tags
    const existingTags = await prisma.tag.findMany({
      where: {
        userId,
        name: { in: tags },
      },
    });

    const existingTagNames = existingTags.map((t) => t.name);
    const newTagNames = tags.filter((t) => !existingTagNames.includes(t));

    // 2. 先建立不存在的 Tags
    if (newTagNames.length > 0) {
      await prisma.tag.createMany({
        data: newTagNames.map((name) => ({ name, userId })),
        skipDuplicates: true,
      });
    }

    // 3. 重新查詢所有需要的 Tag 物件以取得完整的 IDs
    const allTargetTags = await prisma.tag.findMany({
      where: {
        userId,
        name: { in: tags },
      },
      select: { id: true },
    });

    // 4. 透過 ID 進行 connect 關聯建立
    const newTask = await prisma.task.create({
      data: {
        title,
        userId,
        categoryId,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        description,
        tags: {
          connect: allTargetTags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        category: true,
        tags: true,
      },
    });

    // 👈 5. 建立任務成功後，如果有設定到期日，觸發待辦事項提醒通知
    if (newTask.dueDate) {
      try {
        const formattedDate = new Date(newTask.dueDate).toLocaleDateString();
        await NotificationService.notifyTaskReminder(userId, newTask.title, formattedDate);
      } catch (error) {
        console.error('Failed to send task reminder notification:', error);
      }
    }

    return newTask;
  }

 
    // 執行更新任務
   static async updateTask(taskId: string, userId: string, input: UpdateTaskInput) {
  const { title, categoryId, tags, dueDate, isCompleted, description } = input;

  const existingTask = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!existingTask) throw new Error('Task not found');

  const isTargetCompleted = isCompleted !== undefined ? Boolean(isCompleted) : existingTask.isCompleted;

  console.log('--- Debug Task Check ---');
  console.log('existingTask.isCompleted:', existingTask.isCompleted);
  console.log('isTargetCompleted:', isTargetCompleted);
  console.log('existingTask.hasEarnedReward:', existingTask.hasEarnedReward);

  const shouldEarnReward = !existingTask.isCompleted && isTargetCompleted && !existingTask.hasEarnedReward;
  console.log('shouldEarnReward result:', shouldEarnReward);

  let reward = null;
  if (shouldEarnReward) {
    try {
      console.log('Calling WheelService.addTomatoForTask...');
      reward = await WheelService.addTomatoForTask(userId);
      console.log('addTomatoForTask result:', reward);
    } catch (err) {
      console.error('Error in addTomatoForTask:', err);
    }
  }

  // 💡 處理 Tags 的建立與 ID 轉換
  let tagConnectIds: { id: string }[] | undefined = undefined;

  if (tags !== undefined) {
    // 1. 查出傳入標籤中，資料庫已存在的清單
    const existingTags = await prisma.tag.findMany({
      where: { userId, name: { in: tags } },
    });

    const existingTagNames = existingTags.map((t) => t.name);
    const newTagNames = tags.filter((t) => !existingTagNames.includes(t));

    // 2. 自動建立尚未存在的標籤
    if (newTagNames.length > 0) {
      await prisma.tag.createMany({
        data: newTagNames.map((name) => ({ name, userId })),
        skipDuplicates: true,
      });
    }

    // 3. 取得所有目標標籤的 ID
    const targetTags = await prisma.tag.findMany({
      where: { userId, name: { in: tags } },
      select: { id: true },
    });

    tagConnectIds = targetTags.map((t) => ({ id: t.id }));
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId, userId },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(isCompleted !== undefined && {
        isCompleted: isTargetCompleted,
        completedAt: isTargetCompleted ? new Date() : null,
      }),
      ...(shouldEarnReward && { hasEarnedReward: true }),
      ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      ...(categoryId !== undefined && {
        category: categoryId ? { connect: { id: categoryId } } : { disconnect: true },
      }),
      ...(tagConnectIds !== undefined && {
        tags: {
          set: tagConnectIds, // 直接以標籤 ID 覆蓋關聯，安全且直覺
        },
      }),
    },
    include: {
      category: true,
      tags: true,
    },
  });

  return {
    ...updatedTask,
    reward,
  };
}

  // 刪除 Task
  static async deleteTask(taskId: string, userId: string) {
    await this.getTaskById(taskId, userId);
    return await prisma.task.delete({
      where: { id: taskId },
    });
  }
}