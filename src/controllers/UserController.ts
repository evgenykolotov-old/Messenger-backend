import express from 'express';
import User from '../models/User';

class UserController {
  static async find(req: express.Request, res: express.Response) {
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

  static async getMe() {
    //TODO: Сделать возвращение информации о самом себе;
  }

  static create(req: express.Request, res: express.Response) {
    // const { email, fullname, password } = req.body;
    const email = 'e.Kolotov1995@yandex.ru';
    const password = 'Kolot4229';
    const fullname = 'Anastasiya Hyshova';
    const user = new User({ email, fullname, password });
    user.save();
  }

  static async delete(req: express.Request, res: express.Response) {
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
