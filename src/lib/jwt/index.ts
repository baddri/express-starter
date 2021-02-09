import { sign, verify, SignOptions } from 'jsonwebtoken';
import { plainToClass, classToPlain } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { HttpError } from 'routing-controllers';

import { UserPayload } from './UserPayload';
import { User } from '../../api/entities/User';
import { env } from '../../env';

const defaultSignOptions: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '1h',
};

export function getUserToken(user: User, options?: SignOptions): string {
  const payload = new UserPayload(user.id, user.email, user.role);
  return sign(classToPlain(payload), env.app.jwtSecretKey, {
    ...defaultSignOptions,
    ...options,
  });
}

export function verifyToken<T>(token: string, cls: ClassType<T>): T {
  try {
    const payload = verify(token, env.app.jwtSecretKey);
    return plainToClass(cls, payload);
  } catch (error) {
    const err = new HttpError(400, error.message);
    err.name = error.name;
    throw err;
  }
}
