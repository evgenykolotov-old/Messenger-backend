import { Request, Response } from 'express';
import { io } from '../index';
import Dialog from '../models/Dialog';
import Message from '../models/Message';

class DialogController {
  private static socket: any = io;

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const dialogs = await Dialog.find()
        .or([{ author: userId }, { partner: userId }])
        .populate(['author', 'partner'])
        .populate({
          path: 'lastMessage',
          populate: { path: 'user' },
        });
      if (dialogs) {
        res.status(200).json({ status: 'success', result: dialogs });
      } else {
        res.status(404).json({
          status: 'error',
          result: 'Список диалогов пуст',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const author = req.user?._id;
      const { partner, text } = req.body;
      const candidate = await Dialog.findOne({ author, partner });
      if (candidate) {
        res.status(403).json({
          status: 'error',
          result: 'Такой диалог уже существует',
        });
      } else {
        const dialog = new Dialog({ author, partner });
        const message = new Message({ text, dialog: dialog._id, user: author });
        const { _id } = await message.save();
        dialog.lastMessage = _id;
        const dialogResult = await dialog.save();
        res.status(200).json({ status: 'success', result: dialogResult });
        DialogController.socket.emit('SERVER:DIALOG_CREATED', {
          author,
          partner,
          dialog: dialogResult,
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
      const dialog = await Dialog.findByIdAndDelete(id);
      if (dialog) {
        res.status(200).json({ status: 'success', result: 'Диалог был удалён' });
      } else {
        res.status(404).json({ status: 'error', result: 'Диалог не найдён' });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }
}

export default DialogController;
