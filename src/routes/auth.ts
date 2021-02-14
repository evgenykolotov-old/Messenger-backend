import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import loginValidation from '../utils/validations/login';
import registerValidation from '../utils/validations/register';

const router = Router();

router.post('/signup', registerValidation, AuthController.signUp);
router.post('/signin', loginValidation, AuthController.signIn);

export default router;
