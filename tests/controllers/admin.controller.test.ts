import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import adminRouter from '../../src/controllers/admin.controller.js';
import { AppError, ErrorCode } from '../../src/middlewares/errorHandler.js';
import { CopyStatus } from '@prisma/client';

const mockNext = () => vi.fn();

describe('admin.controller - validation middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getValidationMiddleware = (path: string, method: 'get' | 'post' | 'put') => {
    const layer = (adminRouter as any).stack.find(
      (l: any) => l.route?.path === path && l.route?.methods?.[method],
    );
    return layer?.route?.stack?.[0]?.handle;
  };

  describe('GET /copies - validateQuery', () => {
    it('should call next() when validation passes', () => {
      const req = {
        query: { page: '1', pageSize: '20' },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when optional params are missing', () => {
      const req = { query: {} } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('POST /copies - validateBody', () => {
    it('should call next with AppError when bookId is missing', () => {
      const req = {
        body: { barcode: '1234567890', location: 'Shelf A-1' },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('bookId');
    });

    it('should call next with AppError when barcode is missing', () => {
      const req = {
        body: { bookId: 'book-1', location: 'Shelf A-1' },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('barcode');
    });

    it('should call next with AppError when location is missing', () => {
      const req = {
        body: { bookId: 'book-1', barcode: '1234567890' },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('location');
    });

    it('should call next() when validation passes', () => {
      const req = {
        body: { bookId: 'book-1', barcode: '1234567890', location: 'Shelf A-1' },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('PUT /copies/:copyId/status - validateBody', () => {
    it('should call next with AppError when status is missing', () => {
      const req = {
        params: { copyId: 'copy-1' },
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies/:copyId/status', 'put');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('status');
    });

    it('should call next with AppError when status is invalid enum', () => {
      const req = {
        params: { copyId: 'copy-1' },
        body: { status: 'INVALID_STATUS' },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies/:copyId/status', 'put');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
    });

    it('should call next() when validation passes', () => {
      const req = {
        params: { copyId: 'copy-1' },
        body: { status: CopyStatus.AVAILABLE },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/copies/:copyId/status', 'put');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('GET /fines - validateQuery', () => {
    it('should call next() when validation passes', () => {
      const req = {
        query: { page: '1', pageSize: '20' },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/fines', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when optional params are missing', () => {
      const req = { query: {} } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/fines', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('POST /fines/:fineId/waive - validateBody', () => {
    it('should call next with AppError when reason is missing', () => {
      const req = {
        params: { fineId: 'fine-1' },
        body: {},
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/fines/:fineId/waive', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('reason');
    });

    it('should call next() when validation passes', () => {
      const req = {
        params: { fineId: 'fine-1' },
        body: { reason: 'Customer complaint' },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/fines/:fineId/waive', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('GET /audit-logs - validateQuery', () => {
    it('should call next() when validation passes', () => {
      const req = {
        query: { page: '1', pageSize: '20' },
      } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/audit-logs', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should call next() when optional params are missing', () => {
      const req = { query: {} } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/audit-logs', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
