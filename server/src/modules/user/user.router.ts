import { Router,RequestHandler } from 'express';
import { UserController } from './user.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJWT as RequestHandler);

router.get('/profile', UserController.getProfile);
router.patch('/profile', UserController.updateProfile);

export default router;