import jwt from 'jsonwebtoken';
import { reduce } from 'lodash';

interface LoginData {
  email: string;
  password: string;
}

const createJWToken = (user: LoginData): string => {
  const token = jwt.sign(
    {
      data: reduce(
        user,
        (result: any, value: string, key: string) => {
          if (key !== 'password') {
            result[key] = value;
          }
          return result;
        },
        {}
      ),
    },
    <string>process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_MAX_AGE,
      algorithm: 'HS256',
    }
  );
  return token;
};

export default createJWToken;
