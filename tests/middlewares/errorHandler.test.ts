import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { errorHandler, AppError, ErrorCode } from '../../src/middlewares/errorHandler.js';

// Mock log to prevent initialization errors
vi.mock('../../src/registry/index.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockReq = () => ({ path: '/test', method: 'GET' } as Request);
const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as Response);

describe('errorHandler', () => {
  describe('AppError handling', () => {
    it('should return 400 with code/message/errorCode for AppError(400)', () => {
      const err = new AppError(400, 'Validation failed', ErrorCode.VALIDATION_ERROR);
      const req = mockReq();
      const res = mockRes();

      errorHandler(err, req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Validation failed',
        errorCode: 'VALIDATION_ERROR',
      });
    });

    it('should return 404 for NOT_FOUND error', () => {
      const err = new AppError(404, 'Resource not found', ErrorCode.NOT_FOUND);
      const req = mockReq();
      const res = mockRes();

      errorHandler(err, req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        code: 404,
        message: 'Resource not found',
        errorCode: 'NOT_FOUND',
      });
    });

    it('should not include errorCode when not present on AppError', () => {
      const err = new AppError(400, 'Bad request');
      const req = mockReq();
      const res = mockRes();

      errorHandler(err, req, res, vi.fn());

      expect(res.json).toHaveBeenCalledWith({
        code: 400,
        message: 'Bad request',
      });
      expect(res.json).not.toHaveBeenCalledWith(
        expect.objectContaining({ errorCode: expect.anything() }),
      );
    });
  });

  describe('Unknown error handling', () => {
    it('should return 500 with "Internal server error" for unknown errors', () => {
      const err = new Error('Something went wrong');
      const req = mockReq();
      const res = mockRes();

      errorHandler(err, req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Internal server error',
        errorCode: ErrorCode.INTERNAL_ERROR,
      });
    });

    it('should return 500 even for error without message', () => {
      const err = new Error();
      const req = mockReq();
      const res = mockRes();

      errorHandler(err, req, res, vi.fn());

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        code: 500,
        message: 'Internal server error',
        errorCode: ErrorCode.INTERNAL_ERROR,
      });
    });
  });
});
