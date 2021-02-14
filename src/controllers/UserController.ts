import express from 'express';
import { io } from '../index';
import User from '../models/User';

class UserController {
  private static socket: any = io;

  public static async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await User.findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User Not Fround' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public static async getMe(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id: string = req.user._id;
      const user = await User.findById(id);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ message: 'User Not Fround' });
      }
    } catch (error) {
      console.log(error);
    }
  }

  public static async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const user = await User.findByIdAndDelete(id);
      if (user) {
        res.json({ message: `User ${user.fullname} Deleted` });
      } else {
        res.json({ message: 'User Not Fround' });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserController;
