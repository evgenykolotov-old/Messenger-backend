import { Router } from 'express';
import UserController from '../controllers/UserController';

const router = Router();

router.get('/me', UserController.getMe);
router.get('/find', UserController.findUsers);
router.get('/:id', UserController.find);
router.delete('/:id', UserController.delete);

export default router;
