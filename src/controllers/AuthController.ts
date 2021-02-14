import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import createJWToken from '../utils/createJWToken';
import bcrypt from 'bcrypt';

class AuthController {
  public static async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, fullname } = req.body;
      const user: IUser = new User({ email, fullname, password });
      const userResult: IUser = await user.save();
      res.status(201).json(userResult);
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
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Ошибка на сервере',
      });
    }
  }

  public static async logout(req: Request, res: Response): Promise<void> {}

  public static async verify(req: Request, res: Response): Promise<void> {}
}

export default AuthController;
