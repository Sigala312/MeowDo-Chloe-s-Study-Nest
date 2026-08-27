import { Router, RequestHandler } from 'express';
import { CategoryController } from './category.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js'; // JWT 或 Session 驗證

const router = Router();

// 均需登入驗證
router.use(authenticateJWT as RequestHandler);


router.get('/', CategoryController.getAll);
router.post('/', CategoryController.create);
router.put('/:id', CategoryController.update);
router.delete('/:id', CategoryController.delete);

export default router;