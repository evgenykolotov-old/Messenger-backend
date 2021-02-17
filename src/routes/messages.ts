import { Router } from 'express';
import MessageController from '../controllers/MessageController';

const router = Router();

router.get('/', MessageController.findAll);
router.post('/', MessageController.create);
router.delete('/:id', MessageController.delete);

export default router;
