import { Action } from 'routing-controllers';
import { Container } from 'typedi';
import { Connection } from 'typeorm';

import { Roles } from '../api/constants/Roles';
import { Logger } from '../lib/logger';
import { AuthService } from './AuthService';

export function authorizationChecker(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connections: Connection,
): (action: Action, roles: Roles[]) => Promise<boolean> {
  const log = new Logger(__filename);
  const authService = Container.get<AuthService>(AuthService);

  // tslint:disable-next-line: only-arrow-functions
  return async function (action: Action, roles: Roles[]): Promise<boolean> {
    const payload = authService.parseTokenFromRequest(action.request);
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
