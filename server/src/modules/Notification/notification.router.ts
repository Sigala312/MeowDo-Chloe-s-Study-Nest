import { Router,RequestHandler } from 'express';
import { NotificationController } from './notification.controller.js';
// 假設你有驗證 JWT 的中介軟體 (例如 authenticateToken)
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

// 所有通知路由皆須經過身份驗證
 router.use(authenticateJWT as RequestHandler);

router.get('/', NotificationController.getNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.patch('/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);

export default router;