import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import createJWToken from '../utils/createJWToken';
import bcrypt from 'bcrypt';
import { validationResult, Result, ValidationError } from 'express-validator';

class AuthController {
  public static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullname } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const user: IUser = new User({ email, fullname, password });
        const userResult: IUser = await user.save();
        res.status(201).json(userResult);
      }
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Такой пользователь уже есть!',
      });
    }
  }

  public static async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const errors: Result<ValidationError> = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const candidate: IUser | null = await User.findOne({ email });
        if (candidate) {
          const areSame: boolean = bcrypt.compareSync(password, candidate.password);
          if (areSame) {
            const token = createJWToken(candidate);
            res.json({ status: 'success', token });
          } else {
            res.status(403).json({
              status: 'error',
              message: 'Не правильный логин или пароль',
            });
          }
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Пользователь не найден',
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Ошибка на сервере',
      });
    }
  }

  public static async verify(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.query.hash;
      if (!hash) {
        res.status(422).json({
          status: 'error',
          message: 'Недействительная ссылка',
        });
      } else {
        const user: IUser | null = await User.findOne({ confirm_hash: <string>hash });
        if (user) {
          user.confirmed = true;
          await user.save();
          res.json({
            status: 'success',
            message: 'Аккаунт успешно подтвержден!',
          });
        } else {
          res.status(404).json({
            status: 'error',
            message: 'Пользователь не найден',
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Ошибка на сервере',
      });
    }
  }
}

export default AuthController;
