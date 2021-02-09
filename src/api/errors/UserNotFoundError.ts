import { HttpError } from 'routing-controllers';

export class UserNotfoundError extends HttpError {
  constructor() {
    super(404, 'User not found!');
  }
}
