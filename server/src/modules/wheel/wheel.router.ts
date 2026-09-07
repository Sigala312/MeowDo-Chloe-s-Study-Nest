import { Router,RequestHandler } from 'express';
import { WheelController } from './wheel.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js'; // 驗證 JWT / Session Middleware

const router = Router();

// 均需要通過身份驗證
router.use(authenticateJWT as RequestHandler);

router.get('/status', WheelController.getStatus);
router.post('/earn-tomato', WheelController.earnTomato);
router.post('/spin', WheelController.spin);
router.post('/redeem', WheelController.redeem);

export default router;