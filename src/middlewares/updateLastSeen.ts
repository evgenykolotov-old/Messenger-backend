import express from 'express';
import User from '../models/User';

const updateLastSeen = (
  __: express.Request,
  _: express.Response,
  next: express.NextFunction
): void => {
  User.findOneAndUpdate(
    { _id: '601eed00cb2f956b258c4caa' },
    { last_seen: new Date() },
    { new: true }
  );
  next();
};

export default updateLastSeen;
