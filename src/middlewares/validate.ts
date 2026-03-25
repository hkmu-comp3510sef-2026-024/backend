import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError, ErrorCode } from './errorHandler.js';

type AppErrorConstructor = new (
  status: number,
  message: string,
  code: ErrorCode,
  details?: unknown,
) => AppError;

export const validateBody = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

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

export const validateParams = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.params);

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

export const validateQuery = (
  schema: ZodSchema,
  ErrorConstructor: AppErrorConstructor = AppError,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query);

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
