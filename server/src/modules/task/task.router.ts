import { Router, RequestHandler } from 'express';
import { TaskController } from './task.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js'; // 驗證 JWT 的 middleware

const router = Router();

// 所有 Task 路由都必須經過 JWT 身份驗證
router.use(authenticateJWT as RequestHandler);

router.get('/', TaskController.getTasks);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id', TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);

export default router;