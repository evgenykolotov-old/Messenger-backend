import { Request, Response } from 'express';
import { io } from '../index';
import Dialog from '../models/Dialog';
import Message from '../models/Message';

class DialogController {
  private static socket: any = io;

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.user._id;
      const dialogs = await Dialog.find()
        .or([{ author: userId }, { partner: userId }])
        .populate(['author', 'partner'])
        .populate({
          path: 'lastMessage',
          populate: { path: 'user' },
        });
      if (dialogs) {
        res.json(dialogs);
      } else {
        res.status(404).json({
          status: 'error',
          message: 'Список диалогов пуст',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const { author, partner, text } = req.body;
      const candidate = await Dialog.findOne({ author, partner });
      if (candidate) {
        res.status(403).json({
          status: 'error',
          message: 'Такой диалог уже есть',
        });
      } else {
        const dialog = new Dialog({ author, partner });
        const message = new Message({ text, dialog: dialog._id, user: author });
        const { _id } = await message.save();
        dialog.lastMessage = _id;
        const dialogResult = await dialog.save();
        res.json(dialogResult);
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  public static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const dialog = await Dialog.findByIdAndDelete(id);
      if (dialog) {
        res.json({ message: `Dialog Deleted` });
      } else {
        res.json({ message: 'Dialog Not Fround' });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export default DialogController;
