import { Request, Response, NextFunction } from 'express';
import verifyJWTToken from '../utils/verifyJWTToken';
import { DecodedData } from '../utils/verifyJWTToken';

const checkAuth = ( req: Request, res: Response, next: NextFunction ): void => {
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
        res.status(401).json({ status: 'error', result: 'Пользователь не авторизован!' });
      });
  }
};

export default checkAuth;
