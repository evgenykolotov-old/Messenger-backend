import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';
import { Message } from './Message';

export interface Dialog extends Document {
  partner: User | string;
  author: User | string;
  messages: Message[];
  lastMessage: Message | string;
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

const DialogModel = mongoose.model<Dialog>('Dialog', dialogSchema);

export default DialogModel;
