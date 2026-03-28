import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError, ErrorCode } from './errorHandler.js';

type AppErrorConstructor = new (
  status: number,
  message: string,
  code: ErrorCode,
  details?: unknown,
) => AppError;

type RequestLocation = 'body' | 'query' | 'params';

const validate = (
  location: RequestLocation,
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[location]);

    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      const message = errors.map(e => `${e.field}: ${e.message}`).join('; ');
      next(new ErrorConstructor(400, message, ErrorCode.VALIDATION_ERROR, { errors }));
      return;
    }
    next();
  };
};

export const validateBody = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return validate('body', schema, ErrorConstructor);
};

export const validateParams = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return validate('params', schema, ErrorConstructor);
};

export const validateQuery = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return validate('query', schema, ErrorConstructor);
};
