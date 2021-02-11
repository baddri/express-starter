/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthChecker } from 'type-graphql';
import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { ExpressContext } from 'apollo-server-express';

import { Logger } from '../lib/logger';
import { AuthService } from './AuthService';

export function graphqlAuthChecker(
  connection: Connection,
): AuthChecker<ExpressContext> {
  const log = new Logger(__filename);
  const authService = Container.get<AuthService>(AuthService);
  return ({ root, args, context, info }, roles) => {
    const payload = authService.parseTokenFromRequest(context.req);
    if (payload === undefined) {
      log.warn('No token provided!');
      return false;
    }
    if (!roles.length) {
      log.info('No required roles.');
      return true;
    }
    if (!(payload.role in roles)) {
      log.warn(`Role(s) ${roles} is required!`);
      return false;
    }

    log.info('Successfully checked token!');
    return true;
  };
}
