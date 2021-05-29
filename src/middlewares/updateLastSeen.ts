import { Request, Response, NextFunction } from 'express';
import User from '../models/User';

const updateLastSeen = async (req: Request, _: Response, next: NextFunction): Promise<void> => {
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
