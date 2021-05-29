import { Request, Response } from 'express';
import { io } from '../index';
import Message from '../models/Message';
import Dialog from '../models/Dialog';

class MessageController {
  private static socket = io;

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const dialogId: string = <string>req.query.dialog;
      const messages = await Message.find({ dialog: dialogId }).populate('dialog user');
      res.status(200).json({ status: 'success', result: messages });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        result: `Возникла ошибка на сервере: "${error}". Попробуйте позже`,
      });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?._id;
      const { text, dialogId } = req.body;
      const message = new Message({ text, dialog: dialogId, user: userId });
      let messageResult = await message.save();
      messageResult = await messageResult.populate('dialog user').execPopulate();
      await Dialog.findOneAndUpdate(
        { _id: dialogId },
        { lastMessage: message._id },
        { upsert: true }
      );
      res.status(201).json({ status: 'success', result: messageResult });
      MessageController.socket.emit('SERVER:NEW_MESSAGE', messageResult);
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
      const dialog = await Message.findByIdAndDelete(id);
      if (dialog) {
        res.status(200).json({
          status: 'success',
          result: 'Сообщение удалено',
        });
      } else {
        res.status(404).json({
          status: 'error',
          result: 'Ошибка! Сообщение не найдено',
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

export default MessageController;
