import express from 'express';
import verifyJWTToken from '../utils/verifyJWTToken';
import { DecodedData } from '../utils/verifyJWTToken';

const checkAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (
    req.path === '/auth/signin' ||
    req.path === '/auth/signup' ||
    req.path === '/auth/verify'
  ) {
    return next();
  }
  const token: string | null =
    'token' in req.headers ? (req.headers.token as string) : null;
  if (token) {
    verifyJWTToken(token)
      .then((user: DecodedData | null) => {
        if (user) {
          req.user = user.data._doc;
        }
        next();
      })
      .catch(() => {
        res.status(403).json({ message: 'Invalid auth token provided.' });
      });
  }
};

export default checkAuth;
