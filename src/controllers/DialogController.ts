import express from 'express';
import Dialog from '../models/Dialog';

class DialogController {
  static async find(req: express.Request, res: express.Response) {
    try {
      const authorId: string = req.params.id;
      const dialogs = await Dialog.find({ author: authorId }).populate(['author', 'partner']);
      res.json(dialogs);
    } catch (error) {
      console.log(error);
    }
  }

  static async create(req: express.Request, res: express.Response) {
    try {
      const { author, partner } = req.body;
      const dialog = new Dialog({ author, partner });
      const result = await dialog.save();
      res.json(result);
    } catch (error) {
      console.log(error);
    }
  }

  static async delete(req: express.Request, res: express.Response) {
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
