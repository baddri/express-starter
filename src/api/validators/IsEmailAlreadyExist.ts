/* eslint-disable @typescript-eslint/ban-types */
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import { UserService } from '../services/UserService';

@ValidatorConstraint({ async: true })
class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(email: string, args: ValidationArguments) {
    const user = await this.userService.findUser(email);
    if (user) {
      return false;
    }
    return true;
  }
}

/**
 * Check existing @email from database
 */
export function IsEmailAlreadyExist(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  const defaultOptions: ValidationOptions = {
    message: 'Email provided already used!',
  };
  const options: ValidationOptions = {
    ...defaultOptions,
    ...validationOptions,
  };

  // tslint:disable-next-line: only-arrow-functions
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isEmailAlreadyExist',
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
