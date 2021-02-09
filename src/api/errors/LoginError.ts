import { HttpError } from 'routing-controllers';

export class LoginError extends HttpError {
  constructor() {
    super(400, `There's no user with given credentials!`);
    this.name = 'LoginError';
  }
}
