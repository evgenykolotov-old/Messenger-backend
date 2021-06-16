import { Request, Response } from 'express';
import { io } from '../index';
import User from '../models/User';

class UserController {
  private static socket: any = io;

  public static async find(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json({ status: 'success', result: user});
      } else {
        res.status(404).json({
          status: 'error',
          result: 'Пользователь не найден',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async getMe(req: Request, res: Response): Promise<void> {
    try {
      const id = req.user?._id;
      const user = await User.findById(id);
      if (user) {
        res.status(200).json({ status: 'success', result: user });
      } else {
        res.status(404).json({
          status: 'error',
          result: 'Пользователь не найден',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await User.findByIdAndDelete(id);
      if (user) {
        res.status(200).json({
          status: 'success',
          result: `Пользователь ${user.fullname} был удалён`,
        });
      } else {
        res.status(404).json({
          status: 'error',
          result: 'Пользователь не найден',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async findUsers(req: Request, res: Response): Promise<void> {
  	try {
  	  const query = req.query.query;
  	  const users = await User.find().or([
  	    { fullname: new RegExp(String(query), "i")}, 
  	    { email: new RegExp(String(query), "i") }
  	  ]);
  	  if (users) {
  	  	res.status(200).json({
  	  	  status: 'success',
  	  	  result: users,
  	  	})
  	  } else {
        res.status(404).json({
          status: 'error',
          result: 'Пользователи не найдены',
        });  	  	
  	  }
  	} catch (error) {
  	  res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });	
  	}
  }
}

export default UserController;
