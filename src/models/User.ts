import mongoose, { Schema, Document } from 'mongoose';
import isEmail from 'validator/lib/isEmail';

export interface IUser extends Document {
  email: string;
  fullname: string;
  password: string;
  confirmed: boolean;
  avatar: string;
  confirm_hash: string;
  last_seen: Date;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: 'Email address is required',
      validate: [isEmail, 'Invalid email'],
      unique: true,
    },
    avatar: String,
    fullname: {
      type: String,
      required: 'Fullname is required',
    },
    password: {
      type: String,
      required: 'Password is required',
    },
    confirmed: { type: Boolean, default: false },
    confirm_hash: String,
    last_seen: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model<IUser>('User', userSchema);

export default UserModel;
