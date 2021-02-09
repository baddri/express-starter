import { Connection } from 'typeorm';
import { Action } from 'routing-controllers';
import { Container } from 'typedi';

import { AuthService } from './AuthService';
import { User } from '../api/entities/User';
import { UserService } from '../api/services/UserService';

export function currentUserChecker(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connections: Connection,
): (action: Action) => Promise<User | undefined> {
  const authService = Container.get<AuthService>(AuthService);
  const userService = Container.get<UserService>(UserService);
  // tslint:disable-next-line: only-arrow-functions
  return async function (action: Action): Promise<User | undefined> {
    const payload = authService.parseTokenFromRequest(action.request);
    if (payload) {
      return await userService.findUser(payload.username);
    }
    return undefined;
  };
}
