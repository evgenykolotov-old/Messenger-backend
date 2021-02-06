import express from 'express';
import Message from '../models/Message';

class MessageController {
  static async index(req: express.Request, res: express.Response) {
    try {
      const dialogId: string = <string>req.query.dialog;
      const messages = await Message.find({ dialog: dialogId }).populate('dialog');
      res.json(messages);
    } catch (error) {
      console.log(error);
    }
  }

  static async create(req: express.Request, res: express.Response) {
    try {
      const userId: string = '601eed00cb2f956b258c4caa';
      const { text, dialogId } = req.body;
      const message = new Message({ text, dialog: dialogId, user: userId });
      const result = await message.save();
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }
}

export default MessageController;
