import { Router } from 'express';
import DialogController from '../controllers/DialogController';

const router = Router();

router.get('/', DialogController.findAll);
router.post('/', DialogController.create);
router.delete('/:id', DialogController.delete);

export default router;
