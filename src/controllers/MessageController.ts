import express from 'express';
import { io } from '../index';
import Message from '../models/Message';

class MessageController {
  private static socket = io;

  public static async index(req: express.Request, res: express.Response): Promise<void> {
    try {
      const dialogId: string = <string>req.query.dialog;
      const messages = await Message.find({ dialog: dialogId }).populate('dialog');
      res.json(messages);
    } catch (error) {
      console.log(error);
    }
  }

  public static async create(req: express.Request, res: express.Response): Promise<void> {
    try {
      const userId: string = req.user._id;
      const { text, dialogId } = req.body;
      const message = new Message({ text, dialog: dialogId, user: userId });
      let messageResult = await message.save();
      messageResult = await messageResult.populate('dialog user').execPopulate();
      res.json(messageResult);
      MessageController.socket.emit('SERVER:NEW_MESSAGE', messageResult);
    } catch (error) {
      console.log(error);
    }
  }

  public static async delete(req: express.Request, res: express.Response): Promise<void> {
    try {
      const id: string = req.params.id;
      const dialog = await Message.findByIdAndDelete(id);
      if (dialog) {
        res.json({ message: 'Message Deleted' });
      } else {
        res.json({ message: 'Message Not Fround' });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default MessageController;
