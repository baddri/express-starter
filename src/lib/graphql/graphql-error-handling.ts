/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import * as uuid from 'uuid';

import { env } from '../../env';
import { Logger } from '../logger';

// This feature is a copy from https://github.com/kadirahq/graphql-errors
const logger = new Logger('app:errors');

// Mark field/type/schema
export const Processed = Symbol();

// Used to identify UserErrors
export const IsUserError = Symbol();

// UserErrors will be sent to the user
export class UserError extends Error {
  [IsUserError]: boolean;
  constructor(...args: any[]) {
    super(args[0]);
    this.name = 'Error';
    this.message = args[0];
    this[IsUserError] = true;
    Error.captureStackTrace(this);
  }
}

// Modifies errors before sending to the user
export let defaultHandler = (err?: any) => {
  if (err[IsUserError]) {
    return err;
  }
  const errId = uuid.v4();
  err.message = `${err.message}: ${errId}`;
  if (!env.isTest) {
    console.error((err && err.stack) || err);
  }
  if (env.isProduction) {
    logger.error(err);
  }
  err.message = `500: Internal Error: ${errId}`;
  return err;
};

const maskField = (field: any, fn: any) => {
  const resolveFn = field.resolve;
  if (field[Processed] || !resolveFn) {
    return;
  }

  field[Processed] = true;
  field.resolve = async (...args: any[]) => {
    try {
      const out = resolveFn.call(undefined, ...args);
      return await Promise.resolve(out);
    } catch (e) {
      throw fn(e);
    }
  };

  // save the original resolve function
  field.resolve._resolveFn = resolveFn;
};

const maskType = (type: any, fn: any) => {
  if (type[Processed] || !type.getFields) {
    return;
  }

  const fields = type.getFields();
  for (const fieldName in fields) {
    if (!Object.hasOwnProperty.call(fields, fieldName)) {
      continue;
    }
    maskField(fields[fieldName], fn);
  }
};

const maskSchema = (schema: any, fn: any) => {
  const types = schema.getTypeMap();
  for (const typeName in types) {
    if (!Object.hasOwnProperty.call(types, typeName)) {
      continue;
    }
    maskType(types[typeName], fn);
  }
};

// Changes the default error handler function
export const setDefaultHandler = (handlerFn: any) => {
  defaultHandler = handlerFn;
};

// Masks graphql schemas, types or individual fields
export const handlingErrors = (thing: any, fn = defaultHandler) => {
  if (thing instanceof GraphQLSchema) {
    maskSchema(thing, fn);
  } else if (thing instanceof GraphQLObjectType) {
    maskType(thing, fn);
  } else {
    maskField(thing, fn);
  }
};

export const getErrorCode = (message: string): string => {
  if (hasErrorCode(message)) {
    return message.substring(0, 3);
  }
  return '500'; // unkown error code
};

export const getErrorMessage = (message: string): string => {
  if (hasErrorCode(message)) {
    return message.substring(5);
  }
  return message;
};

export const hasErrorCode = (error: any): boolean => {
  let message = error;
  if (error.message) {
    message = error.message;
  }
  const reg = new RegExp('^[0-9]{3}: ');
  return reg.test(message);
};
