import { HttpError } from 'routing-controllers';

export class WrongPasswordError extends HttpError {
  constructor() {
    super(401, 'Wrong password!');
  }
}
