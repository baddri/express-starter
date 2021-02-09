import { HttpError } from 'routing-controllers';

export class UserExistError extends HttpError {
  constructor() {
    super(400, 'User with provided email or username already exist!');
  }
}
