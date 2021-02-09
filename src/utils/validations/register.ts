import { body } from 'express-validator';

export default [
  body('email').isEmail(),
  body('fullname').isLength({ min: 3 }),
  body('password').isLength({ min: 6 }),
];
