import { Router,RequestHandler } from 'express';
import { TagController } from './tag.controller.js';
import { authenticateJWT } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authenticateJWT as RequestHandler);

router.get('/', TagController.getAll);
router.post('/', TagController.create);
router.put('/:id', TagController.update);
router.delete('/:id', TagController.delete);

export default router;