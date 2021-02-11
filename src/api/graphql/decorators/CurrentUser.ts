import { createParamDecorator } from 'type-graphql';
import { ExpressContext } from 'apollo-server-express';
import { Container } from 'typedi';

import { AuthService } from '../../../auth/AuthService';
import { UserService } from '../../services/UserService';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function CurrentUser() {
  const authService = Container.get<AuthService>(AuthService);
  const userService = Container.get<UserService>(UserService);
  return createParamDecorator<ExpressContext>(async ({ context }) => {
    const payload = authService.parseTokenFromRequest(context.req);
    if (payload) {
      return await userService.findUser(payload.email);
    }
    return undefined;
  });
}
