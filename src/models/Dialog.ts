import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IMessage } from './Message';

export interface IDialog extends Document {
  partner: IUser | string;
  author: IUser | string;
  messages: IMessage[];
  lastMessage: IMessage | string;
}

const dialogSchema: Schema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    partner: { type: Schema.Types.ObjectId, ref: 'User' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  {
    timestamps: true,
  }
);

const DialogModel = mongoose.model<IDialog>('Dialog', dialogSchema);

export default DialogModel;
