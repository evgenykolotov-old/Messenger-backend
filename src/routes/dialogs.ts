import { Router } from 'express';
import checkAuth from '../middlewares/checkAuth';
import DialogController from '../controllers/DialogController';

const router = Router();

router.get('/', DialogController.find);
router.delete('/:id', DialogController.delete);
router.post('/', DialogController.create);

export default router;
