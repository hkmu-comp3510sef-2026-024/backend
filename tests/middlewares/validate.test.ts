import { describe, it, expect, vi } from 'vitest';
import { validateBody, validateQuery, validateParams } from '../../src/middlewares/validate.js';
import { AppError, ErrorCode } from '../../src/middlewares/errorHandler.js';
import { z } from 'zod';

// Mock log to prevent initialization errors
vi.mock('../../src/registry/index.js', () => ({
  log: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const mockReq = (body: unknown = {}, query: unknown = {}, params: unknown = {}) => ({
  body,
  query,
  params,
});
const mockRes = () => ({ status: vi.fn().mockReturnThis(), json: vi.fn() });
const mockNext = () => vi.fn();

describe('validateBody', () => {
  const schema = z.object({
    name: z.string(),
    age: z.number(),
  });

  it('should call next() without error when validation passes', () => {
    const req = mockReq({ name: 'John', age: 25 });
    const next = mockNext();

    validateBody(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() with AppError when validation fails', () => {
    const req = mockReq({ name: 'John', age: 'not-a-number' });
    const next = mockNext();

    validateBody(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('should join error messages with semicolon', () => {
    const req = mockReq({ name: 123, age: 'not-a-number' });
    const next = mockNext();

    validateBody(schema)(req as any, {} as any, next);

    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error.message).toContain(';');
  });

  it('should use default AppError when ErrorConstructor not provided', () => {
    const req = mockReq({ name: 123 });
    const next = mockNext();

    validateBody(schema)(req as any, {} as any, next);

    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error).toBeInstanceOf(AppError);
  });

  it('should not throw when req is mutated after validation', () => {
    const req = mockReq({ name: 'John', age: 25 });
    const next = mockNext();

    validateBody(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });
});

describe('validateQuery', () => {
  const schema = z.object({
    barcode: z.string(),
    page: z.number(),
  });

  it('should call next() without error when validation passes', () => {
    const req = mockReq({}, { barcode: '123', page: 1 });
    const next = mockNext();

    validateQuery(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next() with AppError when validation fails', () => {
    const req = mockReq({}, { barcode: 123 }); // barcode should be string
    const next = mockNext();

    validateQuery(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });

  it('should join error messages with semicolon', () => {
    const req = mockReq({}, { barcode: 123, page: 'not-a-number' });
    const next = mockNext();

    validateQuery(schema)(req as any, {} as any, next);

    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error.message).toContain(';');
  });
});

describe('validateParams', () => {
  const schema = z.object({
    id: z.string().uuid(),
  });

  it('should call next() without error when validation passes', () => {
    const req = mockReq({}, {}, { id: '123e4567-e89b-12d3-a456-426614174000' });
    const next = mockNext();

    validateParams(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next() with AppError when validation fails', () => {
    const req = mockReq({}, {}, { id: 'not-a-uuid' });
    const next = mockNext();

    validateParams(schema)(req as any, {} as any, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as ReturnType<typeof mockNext>).mock.calls[0][0];
    expect(error.statusCode).toBe(400);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
  });
});
