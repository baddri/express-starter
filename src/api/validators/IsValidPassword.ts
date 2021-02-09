/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsValidPassword(
  validationOptions?: ValidationOptions,
): (object: object, propertyName: string) => void {
  const defaultOptions: ValidationOptions = {
    message:
      'password must be at least 8 characters long contain a number and an uppercase letter',
  };
  const options = { ...defaultOptions, ...validationOptions };

  // tslint:disable-next-line: only-arrow-functions
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidPassword',
      target: object.constructor,
      propertyName,
      constraints: [],
      options,
      validator: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(value: any, args: ValidationArguments): boolean {
          return (
            typeof value === 'string' &&
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm.test(value)
          );
        },
      },
    });
  };
}
