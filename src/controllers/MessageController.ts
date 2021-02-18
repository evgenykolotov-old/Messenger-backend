import { Request, Response } from 'express';
import { io } from '../index';
import Message, { IMessage } from '../models/Message';
import Dialog from '../models/Dialog';

class MessageController {
  private static socket = io;

  public static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const dialogId: string = <string>req.query.dialog;
      const messages = await Message.find({ dialog: dialogId }).populate('dialog user');
      res.json(messages);
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }

  public static async create(req: Request, res: Response): Promise<void> {
    try {
      const userId: string = req.user._id;
      const { text, dialogId } = req.body;
      const message: IMessage = new Message({ text, dialog: dialogId, user: userId });
      let messageResult = await message.save();
      messageResult = await messageResult.populate('dialog user').execPopulate();
      await Dialog.findOneAndUpdate(
        { _id: dialogId },
        { lastMessage: message._id },
        { upsert: true }
      );
      res.json(messageResult);
      MessageController.socket.emit('SERVER:NEW_MESSAGE', messageResult);
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
      const dialog = await Message.findByIdAndDelete(id);
      if (dialog) {
        res.json({
          status: 'success',
          message: 'Message Deleted',
        });
      } else {
        res.status(403).json({
          status: 'error',
          message: 'Message Not Fround',
        });
      }
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error,
      });
    }
  }
}

export default MessageController;
