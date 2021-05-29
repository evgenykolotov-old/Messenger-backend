import mongoose, { Schema, Document } from 'mongoose';
import generatePasswordHash from '../utils/generatePasswordHash';
import isEmail from 'validator/lib/isEmail';
import differenceInMinutes from 'date-fns/differenceInMinutes';

export interface User extends Document {
  _id?: string;
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
      required: 'Email является обязательным полем',
      validate: [isEmail, 'Невалидный email'],
      unique: true,
    },
    avatar: String,
    fullname: {
      type: String,
      required: 'Введите имя или ник пользователя',
    },
    password: {
      type: String,
      required: 'Введите пароль',
    },
    confirmed: { type: Boolean, default: false },
    confirm_hash: String,
    last_seen: { type: Date, default: new Date() },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual('isOnline').get(function (this: User) {
  return differenceInMinutes(new Date(), this.last_seen) < 5;
});

userSchema.set('toJSON', { virtuals: true });

userSchema.pre<User>('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  user.password = await generatePasswordHash(user.password);
  user.confirm_hash = await generatePasswordHash(new Date().toString());
});

const UserModel = mongoose.model<User>('User', userSchema);

export default UserModel;
