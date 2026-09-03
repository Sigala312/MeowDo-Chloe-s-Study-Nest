import { Request, Response } from 'express';
import { TaskService } from './task.service.js';
import { createTaskSchema, updateTaskSchema } from './task.schema.js';

export class TaskController {
  // GET /api/tasks
  static async getTasks(req: Request, res: Response) {
    try {
      const userId = (req.user as { id: string }).id; // 從 Auth Middleware 取得
      const tasks = await TaskService.getTasksByUserId(userId);

      return res.status(200).json({
        success: true,
        data: tasks,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // POST /api/tasks
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

  // PUT /api/tasks/:id
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

      // Zod 驗證 (確保 updateTaskSchema 支援 partial 更新)
      const parseResult = updateTaskSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({
          success: false,
          errors: parseResult.error.flatten().fieldErrors,
        });
      }

      const updatedTask = await TaskService.updateTask(taskId, userId, parseResult.data);

      if (!updatedTask) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or unauthorized',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // DELETE /api/tasks/:id
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