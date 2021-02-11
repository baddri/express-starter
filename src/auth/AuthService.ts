import express from 'express';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';

import { verifyToken } from '../lib/jwt';

import { UserRepository } from '../api/repositories/UserRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';
import { UserPayload } from '../lib/jwt/UserPayload';

@Service()
export class AuthService {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @Logger(__filename) private log: LoggerInterface,
  ) {}

  public parseTokenFromRequest(req: express.Request): UserPayload | undefined {
    const authorization = req.header('Authorization');
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      return verifyToken(authorization.split(' ')[1], UserPayload);
    }
    return undefined;
  }
}
