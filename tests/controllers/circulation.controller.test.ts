import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import circulationRouter from '../../src/controllers/circulation.controller.js';
import { AppError, ErrorCode } from '../../src/middlewares/errorHandler.js';

const mockNext = () => vi.fn();

describe('circulation.controller - validation middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const getValidationMiddleware = (path: string, method: 'post' | 'get') => {
    const layer = (circulationRouter as any).stack.find(
      (l: any) => l.route?.path === path && l.route?.methods?.[method],
    );
    return layer?.route?.stack?.[0]?.handle;
  };

  describe('POST /checkout - validateBody', () => {
    it('should call next with AppError when memberId is missing', () => {
      const req = { body: { copyBarcode: '1234567890' } } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/checkout', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
      expect(error.message).toContain('memberId');
    });

    it('should call next with AppError when copyBarcode is missing', () => {
      const req = { body: { memberId: 'member-1' } } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/checkout', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('copyBarcode');
    });

    it('should call next() when validation passes', () => {
      const req = {
        body: { memberId: 'member-1', copyBarcode: '1234567890' },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/checkout', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('POST /return - validateBody', () => {
    it('should call next with AppError when copyBarcode is missing', () => {
      const req = { body: { condition: 1 } } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/return', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('copyBarcode');
    });

    it('should call next with AppError when condition is invalid', () => {
      const req = { body: { copyBarcode: '1234567890', condition: 99 } } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/return', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('condition');
    });

    it('should call next() when validation passes', () => {
      const req = {
        body: { copyBarcode: '1234567890', condition: 1 },
      } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/return', 'post');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('GET /lookup - validateQuery', () => {
    it('should call next with AppError when barcode is missing', () => {
      const req = { query: {} } as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/lookup', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
      expect(error.statusCode).toBe(400);
      expect(error.message).toContain('barcode');
    });

    it('should call next() when validation passes', () => {
      const req = { query: { barcode: '1234567890' } } as unknown as Request;
      const res = {} as Response;
      const next = mockNext();

      const middleware = getValidationMiddleware('/lookup', 'get');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
