import { Request, Response, NextFunction } from 'express';
import { ErrorCode } from '../utils/errorCode.js';
import { log } from '../registry/index.js';

export { ErrorCode };

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: ErrorCode,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const context = 'ErrorHandler';

  if (err instanceof AppError) {
    log.warn(context, `AppError: ${err.message}`, {
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      code: err.statusCode,
      message: err.message,
      ...(err.code && { errorCode: err.code }),
    });
    return;
  }

  log.error(context, `Unhandled error: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    code: 500,
    message: 'Internal server error',
    errorCode: ErrorCode.INTERNAL_ERROR,
  });
};
