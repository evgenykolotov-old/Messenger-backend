import { Request, Response } from 'express';
import User from '../models/User';
import createJWToken from '../utils/createJWToken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

class AuthController {
  public static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullname } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ status: 'error', result: errors.array() });
      } else {
        const candidate = await User.findOne({ email });
        if (!candidate) {
          const user = new User({ email, fullname, password });
          const userResult = await user.save();
          res.status(201).json({ status: 'success', result: userResult });
        } else {
          res.status(403).json({ status: 'error', result: 'Такой пользователь уже существует' })
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async signIn(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
      } else {
        const candidate = await User.findOne({ email });
        if (candidate) {
          const areSame: boolean = bcrypt.compareSync(password, candidate.password);
          if (areSame) {
            const token = createJWToken(candidate);
            res.status(200).json({ status: 'success', result: token });
          } else {
            res.status(403).json({
              status: 'error',
              result: 'Не правильный логин или пароль',
            });
          }
        } else {
          res.status(404).json({
            status: 'error',
            result: 'Пользователь не найден',
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async verify(req: Request, res: Response): Promise<void> {
    try {
      const hash = req.query.hash;
      if (!hash) {
        res.status(422).json({
          status: 'error',
          result: 'Недействительная ссылка',
        });
      } else {
        const user = await User.findOne({ confirm_hash: <string>hash });
        if (user) {
          user.confirmed = true;
          await user.save();
          res.json({
            status: 'success',
            result: 'Аккаунт успешно подтвержден!',
          });
        } else {
          res.status(404).json({
            status: 'error',
            result: 'Пользователь не найден',
          });
        }
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }
}

export default AuthController;
