import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/me', UserController.getMe);
router.get('/:id', UserController.index);
router.delete('/:id', UserController.delete);

export default router;
