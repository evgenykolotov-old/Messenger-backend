import express from 'express';
import User from '../models/User';

const updateLastSeen = async (
  req: express.Request,
  _: express.Response,
  next: express.NextFunction
): Promise<void> => {
  if (req.user) {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { last_seen: new Date() },
      { new: true }
    );
  }
  next();
};

export default updateLastSeen;
