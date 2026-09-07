import { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import { createTaskSchema, updateTaskSchema } from './task.schema.js';

export class TaskController {
  // GET /api/task or /api/tasks
  static async getTasks(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const tasks = await TaskService.getTasksByUserId(userId);

      return res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/task or /api/tasks
  static async createTask(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;

      // Zod 驗證 Request Body
      const parseResult = createTaskSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        });
      }

      const newTask = await TaskService.createTask(userId, parseResult.data);

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: newTask,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // PATCH /api/task/:id
  static async updateTask(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const taskId = req.params.id;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid Task ID',
        });
      }

      // Zod 部分更新驗證
      const parseResult = updateTaskSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        });
      }

      // TaskService.updateTask 建議回傳包含 { task, reward } 或直接回傳 result 物件
      const result = await TaskService.updateTask(taskId, userId, parseResult.data);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or unauthorized',
        });
      }

      // 透傳包含 task 與 reward (若有) 的完整物件給前端
      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/task/:id
  static async deleteTask(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id;
      const taskId = req.params.id;

      if (!taskId || typeof taskId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid Task ID',
        });
      }

      await TaskService.deleteTask(taskId, userId);

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}