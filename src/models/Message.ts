import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  text: string;
  dialog: string;
  read: boolean;
}

const messageSchema: Schema = new Schema(
  {
    text: { type: String, require: Boolean },
    dialog: { type: Schema.Types.ObjectId, ref: 'Dialog', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model<Message>('Message', messageSchema);

export default MessageModel;
