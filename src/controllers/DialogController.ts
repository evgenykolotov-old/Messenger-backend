import express from 'express';
import { io } from '../index';
import Dialog from '../models/Dialog';
import Message from '../models/Message';

class DialogController {
  private static socket: any = io;

  public static async find(req: express.Request, res: express.Response): Promise<void> {
    try {
      const authorId: string = req.user._id;
      const dialogs = await Dialog.find({ author: authorId }).populate([
        'author',
        'partner',
      ]);
      res.json(dialogs);
    } catch (error) {
      console.log(error);
    }
  }

  public static async create(req: express.Request, res: express.Response): Promise<void> {
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

  public static async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const dialog = await Dialog.findByIdAndDelete(id);
      if (dialog) {
        res.json({ message: `Dialog Deleted` });
      } else {
        res.json({ message: 'Dialog Not Fround' });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default DialogController;
